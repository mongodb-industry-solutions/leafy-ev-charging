#!/usr/bin/env python3
"""Chunk the ArcPort Home 22 manual for vector seeding.

Parses the Markdown manual into one chunk per ## / ### heading, prepends a
context header (product + heading path) so every chunk embeds and retrieves
self-descriptively, and writes the records to JSON.

The embedding / MongoDB insertion step is intentionally separate: run this
first, review the chunks, then feed the JSON to the embed-and-seed step.

Usage:
    python3 seed_manual.py                       # defaults to sibling manual
    python3 seed_manual.py -o /tmp/chunks.json   # custom output path
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SOURCE = "ArcPort_Home_22_Manual.md"
PRODUCT = "ArcPort Home 22"

# A heading is only detected outside fenced code blocks so that ``` blocks
# containing lines like "## something" are never split on.
HEADING_RE = re.compile(r"^(?P<level>#{2,3})\s+(?P<text>.+?)\s*$")
REVISION_RE = re.compile(r"Document revision:\s*(\d+)")


def parse_chunks(markdown: str) -> list[dict]:
    """Split markdown into one record per heading, with heading paths."""
    lines = markdown.splitlines()
    chunks: list[dict] = []
    heading_path: list[str] = []  # last [##, ###] headings seen
    body: list[str] = []
    in_fence = False

    def flush() -> None:
        text = "\n".join(body).strip()
        if not heading_path or not text:
            return
        section = " > ".join(heading_path)
        chunks.append(
            {
                "text": f"{PRODUCT} > {section}\n\n{text}",
                "source": SOURCE,
                "section": section,
                "heading": heading_path[-1],
                "model": PRODUCT,
            }
        )

    for line in lines:
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            body.append(line)
            continue
        if not in_fence and (match := HEADING_RE.match(line)):
            flush()
            body = []
            if match.group("level") == "##":
                heading_path = [match.group("text")]
            else:
                heading_path = heading_path[:1] + [match.group("text")]
            continue
        body.append(line)

    flush()
    return chunks


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).parent / SOURCE,
        help="Path to the manual markdown (default: sibling manual)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output JSON path (default: <input stem>_chunks.json)",
    )
    args = parser.parse_args()

    markdown = args.input.read_text(encoding="utf-8")
    revision_match = REVISION_RE.search(markdown)

    chunks = parse_chunks(markdown)
    for chunk in chunks:
        chunk["revision"] = int(revision_match.group(1)) if revision_match else None

    sizes = [chunk["text"].count("\n") + 1 for chunk in chunks]
    print(
        f"{len(chunks)} chunks | lines per chunk "
        f"min {min(sizes)} / avg {sum(sizes) / len(sizes):.0f} / max {max(sizes)}"
    )

    output = args.output or args.input.with_name(f"{args.input.stem}_chunks.json")
    output.write_text(
        json.dumps(chunks, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
