#!/usr/bin/env python3
"""Chunk the ArcPort Home 22 manual, embed it with Voyage, seed MongoDB.

    python3 seed_manual.py --dry-run           # chunk + stats, no network
    python3 seed_manual.py --dry-run --show 5  # also print 5 sample chunks
    python3 seed_manual.py                     # embed + seed + search indexes
    python3 seed_manual.py --limit 5           # a quick pass
    python3 seed_manual.py --drop              # replace the collection
    python3 seed_manual.py --model voyage-3-large

Chunks follow the manual's own #, ## and ### headings. Each chunk's `text` is
prefixed with a context header (product + heading path) so it embeds and
retrieves self-descriptively; the bare section text is also stored as `body`
for display. Error/warning/notice codes (E-05, W-204, N-403, ...) found in a
chunk are stored in `codes`, because vector search is weak on exact tokens.

Two Atlas search indexes are created:
  * `default`  (vectorSearch) on `embedding`, with filter fields
  * `lexical`  (search) on `text` / `heading` / `codes`, for hybrid retrieval

The vector index is sized from the vectors Voyage returns, so the model and
the index can never drift apart. Every record stores `embeddingModel`.

Env (repo-root .env): MONGODB_URI, MONGODB_DATABASE, VOYAGE_API_KEY.
Requires pymongo in the venv:  pip install pymongo python-dotenv
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
import certifi

try:
    from dotenv import load_dotenv
except ImportError:  # dry runs need no .env
    def load_dotenv(*_args, **_kwargs) -> bool:
        return False

REPO_ROOT = Path(__file__).resolve().parents[2]
for env_file in (REPO_ROOT / ".env", Path(__file__).resolve().parents[1] / ".env"):
    if env_file.exists():
        load_dotenv(env_file)

logging.basicConfig(level=logging.INFO, format="%(message)s")
log = logging.getLogger("seed_manual")

PRODUCT = "ArcPort Home 22 (NV-AP22)"
SOURCE = "ArcPort_Home_22_Manual.md"
COLLECTION = "manualChunks"
VOYAGE_URL = "https://api.voyageai.com/v1/embeddings"
VECTOR_INDEX = "default"
LEXICAL_INDEX = "lexical"
DEFAULT_MODEL = "voyage-3.5"
MAX_ATTEMPTS = 4
RETRYABLE_STATUS = (429, 500, 502, 503, 504)

# Levels 1-3: the manual's major sections are "#" headings, and their intro
# text/tables must not be glued onto the previous chunk.
HEADING_RE = re.compile(r"^(?P<level>#{1,3})\s+(?P<text>.+?)\s*$")
REVISION_RE = re.compile(r"Document revision:\*{0,2}\s*(\d+)")
CODE_RE = re.compile(r"\b([EWN])-(\d{2,3})\b")
SKIP_HEADINGS = {"Table of Contents"}


def extract_codes(text: str) -> list[str]:
    """Error / warning / notice codes mentioned in a chunk, e.g. E-05."""
    return sorted({f"{kind}-{num}" for kind, num in CODE_RE.findall(text)})


def parse_chunks(markdown: str) -> list[dict]:
    """Split markdown into one record per heading, with heading paths.

    Headings are only detected outside fenced code blocks, so ``` blocks
    containing lines like "## something" are never split on.
    """
    chunks: list[dict] = []
    heading_path: list[str] = []  # [#, ##, ###] headings currently in scope
    body: list[str] = []
    in_fence = False

    def flush() -> None:
        text = "\n".join(body).strip()
        if not heading_path or not text:
            return
        if heading_path[-1] in SKIP_HEADINGS:
            return
        section = " > ".join(heading_path)
        chunks.append(
            {
                "text": f"{PRODUCT} > {section}\n\n{text}",
                "body": text,
                "source": SOURCE,
                "product": PRODUCT,
                "section": section,
                "heading": heading_path[-1],
                "codes": extract_codes(f"{heading_path[-1]}\n{text}"),
            }
        )

    for line in markdown.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            body.append(line)
            continue
        if not in_fence and (match := HEADING_RE.match(line)):
            flush()
            body = []
            level = len(match.group("level"))
            heading_path = heading_path[: level - 1] + [match.group("text")]
            continue
        body.append(line)

    flush()
    return chunks


def ssl_context() -> ssl.SSLContext:
    """TLS context that verifies certificates, with a usable CA bundle.

    Order: SSL_CERT_FILE / REQUESTS_CA_BUNDLE (e.g. a corporate proxy CA
    bundle), then certifi if installed, then the system default store.
    """
    cafile = os.getenv("SSL_CERT_FILE") or os.getenv("REQUESTS_CA_BUNDLE")
    if not cafile:
        try:
            import certifi

            cafile = certifi.where()
        except ImportError:
            cafile = None
    return ssl.create_default_context(cafile=cafile)


SSL_HELP = (
    "TLS certificate verification failed. Fix your CA bundle; do not disable "
    "verification.\n"
    "    * macOS python.org Python: run 'Install Certificates.command' in "
    "/Applications/Python 3.x/, or 'pip install certifi'\n"
    "    * Corporate proxy/VPN: export SSL_CERT_FILE=/path/to/corp-ca-bundle.pem"
)


def embed_batch(texts: list[str], model: str, api_key: str) -> tuple[list, dict]:
    """Embed one batch via the Voyage API; returns (vectors, usage)."""
    request = urllib.request.Request(
        VOYAGE_URL,
        data=json.dumps(
            {"input": texts, "model": model, "input_type": "document"}
        ).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    context = ssl_context()
    last_error: Exception | None = None
    for attempt in range(MAX_ATTEMPTS):
        try:
            with urllib.request.urlopen(request, timeout=60, context=context) as response:
                payload = json.load(response)
            return (
                [item["embedding"] for item in payload["data"]],
                payload.get("usage", {}),
            )
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")[:500]
            last_error = RuntimeError(f"HTTP {error.code}: {detail}")
            if error.code not in RETRYABLE_STATUS:
                raise last_error from error  # bad model/key/payload: don't retry
        except urllib.error.URLError as error:
            if isinstance(error.reason, ssl.SSLError):
                # Retrying cannot fix a certificate problem.
                raise RuntimeError(f"{SSL_HELP}\n    ({error.reason})") from error
            last_error = error

        if attempt < MAX_ATTEMPTS - 1:
            delay = 2 ** (attempt + 1)
            log.info(f"    retrying in {delay}s ({last_error})")
            time.sleep(delay)

    raise RuntimeError(f"Voyage request failed after {MAX_ATTEMPTS} attempts: {last_error}")


def upsert_search_index(collection, name: str, index_type: str, definition: dict) -> str:
    """Create the Atlas search index, or update it if it already exists."""
    existing = {index["name"] for index in collection.list_search_indexes()}
    if name in existing:
        collection.update_search_index(name, definition)
        return "updated"
    collection.create_search_index(
        model={"name": name, "type": index_type, "definition": definition}
    )
    return "created"


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).parent / SOURCE,
        help="Path to the manual markdown",
    )
    parser.add_argument("--limit", type=int, default=None, help="Max chunks to seed")
    parser.add_argument("--drop", action="store_true", help="Drop the collection first")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Voyage text model")
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument(
        "--pause",
        type=float,
        default=0.0,
        help="Seconds to wait between batches (raise on low rate-limit tiers)",
    )
    parser.add_argument(
        "--show", type=int, default=0, help="Print N sample chunks (with --dry-run)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Chunk and print stats without any network or database access",
    )
    args = parser.parse_args()

    started = time.perf_counter()
    if not args.input.exists():
        print(f"\n  Manual not found: {args.input}\n")
        return 1
    markdown = args.input.read_text(encoding="utf-8")
    revision_match = REVISION_RE.search(markdown)
    revision = int(revision_match.group(1)) if revision_match else None

    chunks = parse_chunks(markdown)
    for chunk in chunks:
        chunk["revision"] = revision
        chunk["embeddingModel"] = args.model
    if args.limit:
        chunks = chunks[: args.limit]
    if not chunks:
        print("\n  No chunks produced. Check --input and the heading format.\n")
        return 1

    words = [len(chunk["body"].split()) for chunk in chunks]
    with_codes = sum(1 for chunk in chunks if chunk["codes"])
    print(
        f"\n  Manual      {args.input.name}, revision {revision}"
        f"\n  Chunks      {len(chunks)} | words per chunk "
        f"min {min(words)} / avg {sum(words) / len(words):.0f} / max {max(words)}"
        f"\n  With codes  {with_codes} chunks mention an E-/W-/N- code"
    )

    if args.dry_run:
        for chunk in chunks[: args.show]:
            print(f"\n  --- {chunk['section']}  codes={chunk['codes']}")
            print("  " + chunk["text"][:300].replace("\n", "\n  "))
        print("\n  Dry run — stopping before embedding and seeding.\n")
        return 0

    api_key = os.getenv("VOYAGE_API_KEY")
    if not api_key:
        print("\n  No VOYAGE_API_KEY set. Add it to the repo-root .env first.\n")
        return 1
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("\n  No MONGODB_URI set. Add it to the repo-root .env first.\n")
        return 1
    database_name = os.getenv("MONGODB_DATABASE")
    if not database_name:
        print("\n  No MONGODB_DATABASE set. Add it to the repo-root .env first.\n")
        return 1

    # Embedding: one batched call per --batch-size chunks. Vectors arrive in
    # input order, so they zip straight onto the chunk records. Nothing in
    # the database is touched until every batch has succeeded.
    print(f"\n  Embedding {len(chunks)} chunks with {args.model}...")
    total_tokens = 0
    for start in range(0, len(chunks), args.batch_size):
        batch = chunks[start : start + args.batch_size]
        vectors, usage = embed_batch(
            [chunk["text"] for chunk in batch], args.model, api_key
        )
        if len(vectors) != len(batch):
            raise RuntimeError(
                f"Voyage returned {len(vectors)} vectors for {len(batch)} inputs"
            )
        for chunk, vector in zip(batch, vectors):
            chunk["embedding"] = vector
        total_tokens += usage.get("total_tokens", 0)
        print(f"    {min(start + args.batch_size, len(chunks))}/{len(chunks)}")
        if args.pause and start + args.batch_size < len(chunks):
            time.sleep(args.pause)

    num_dimensions = len(chunks[0]["embedding"])

    from pymongo import MongoClient
    from pymongo.errors import OperationFailure

    client = MongoClient(mongodb_uri, tlsCAFile=certifi.where())
    collection = client[database_name][COLLECTION]

    if args.drop:
        collection.drop()
    else:
        # Re-seed is idempotent per source document.
        collection.delete_many({"source": SOURCE})

    collection.insert_many(chunks, ordered=False)
    print(f"\n  Stored {len(chunks)} chunks in {database_name}.{COLLECTION}")

    vector_definition = {
        "fields": [
            {
                "type": "vector",
                "path": "embedding",
                "numDimensions": num_dimensions,
                "similarity": "cosine",
            },
            # Pre-filter fields for $vectorSearch `filter`.
            {"type": "filter", "path": "source"},
            {"type": "filter", "path": "product"},
            {"type": "filter", "path": "revision"},
            {"type": "filter", "path": "codes"},
        ]
    }
    lexical_definition = {
        "mappings": {
            "dynamic": False,
            "fields": {
                "text": {"type": "string"},
                "heading": {"type": "string"},
                # Exact, case-sensitive match on codes such as "E-05".
                "codes": {"type": "string", "analyzer": "lucene.keyword"},
            },
        }
    }

    try:
        action = upsert_search_index(
            collection, VECTOR_INDEX, "vectorSearch", vector_definition
        )
        print(f"  Vector index  {VECTOR_INDEX} {action} ({num_dimensions} dims)")
        action = upsert_search_index(
            collection, LEXICAL_INDEX, "search", lexical_definition
        )
        print(f"  Lexical index {LEXICAL_INDEX} {action}")
        print("  Both are building in the background")
    except OperationFailure as error:
        print(f"\n  Could not create the search indexes: {error.details or error}")
        print("  Atlas Search needs an Atlas cluster (vector search: dedicated, M10+).")
        print("  The documents are seeded; create the indexes manually if needed.")

    print(f"\n  Embeddings   {total_tokens:,} tokens ({args.model})")
    print(f"  Total        {time.perf_counter() - started:,.1f}s\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())