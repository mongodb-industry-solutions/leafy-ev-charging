"use client";

import { Code } from "@leafygreen-ui/code";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import Modal from "@leafygreen-ui/modal";
import { Tab, Tabs } from "@leafygreen-ui/tabs";
import { Body, H3 } from "@leafygreen-ui/typography";
import {
  type MouseEvent,
  type RefObject,
  useMemo,
  useRef,
  useState
} from "react";

import {
  MONGO_SPOTLIGHTS,
  type MongoSpotlightId,
  type SpotlightSnippet
} from "@/lib/utils/mongoSpotlights";

interface MongoSpotlightProps {
  /** Key into the spotlight content registry. */
  id: MongoSpotlightId;
  /**
   * Optional already-loaded data to show as an extra "Live data" tab, turning
   * a static snippet into a live example (rendered as pretty-printed JSON).
   */
  liveJson?: unknown;
  /** Label for the live-data tab. */
  liveLabel?: string;
  /**
   * Friendly hint shown in the live-data tab when `liveJson` is empty (empty
   * array or object), nudging the user toward an action that produces data.
   */
  liveEmptyHint?: string;
  /** Size of the trigger icon button. */
  size?: "default" | "large" | "xlarge";
  /** Render the trigger for a dark background. */
  darkMode?: boolean;
  /**
   * When set, the trigger renders as a single clickable pill (label + icon)
   * instead of a bare icon button, so the whole badge opens the modal.
   */
  label?: string;
  /** Extra classes for the trigger wrapper / pill. */
  className?: string;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(
      value,
      (key, val) => {
        // Drop GraphQL artifacts so the live data reads like the stored document.
        if (key === "__typename") return undefined;
        return typeof val === "bigint" ? val.toString() : val;
      },
      2
    );
  } catch {
    return "// Unable to serialize live data";
  }
}

function isEmptyLiveData(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length === 0;
  }
  return false;
}

export function MongoSpotlight({
  id,
  liveJson,
  liveLabel = "Live data",
  liveEmptyHint = "No live data yet — interact with the app to generate some!",
  size = "default",
  darkMode = false,
  label,
  className
}: MongoSpotlightProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const entry = MONGO_SPOTLIGHTS[id];

  const snippets = useMemo<SpotlightSnippet[]>(() => {
    const base: SpotlightSnippet[] = entry.snippets;
    if (liveJson === undefined || liveJson === null) return base;

    const live: SpotlightSnippet["live"] = isEmptyLiveData(liveJson)
      ? { label: liveLabel, hint: liveEmptyHint }
      : { label: liveLabel, code: safeStringify(liveJson) };

    // If a snippet opts in as the live slot, render the live data inside that
    // tab (below its code) rather than as a separate leading "Live data" tab.
    const targetIndex = base.findIndex((snippet) => snippet.liveSlot);
    if (targetIndex >= 0) {
      return base.map((snippet, index) =>
        index === targetIndex ? { ...snippet, live } : snippet
      );
    }

    const liveSnippet: SpotlightSnippet = isEmptyLiveData(liveJson)
      ? { label: liveLabel, language: "json", code: "", hint: liveEmptyHint }
      : {
          label: liveLabel,
          language: "json",
          caption: "The data currently rendered on screen, straight from MongoDB.",
          code: safeStringify(liveJson)
        };
    return [liveSnippet, ...base];
  }, [entry.snippets, liveJson, liveLabel, liveEmptyHint]);

  const openModal = (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.stopPropagation();
    setSelected(0);
    setOpen(true);
  };

  return (
    <>
      {label ? (
        <button
          type="button"
          onClick={openModal}
          aria-label={`Show the MongoDB behind: ${entry.title}`}
          title="See the MongoDB behind this"
          className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
        >
          <span>{label}</span>
          <Icon glyph="CurlyBraces" />
        </button>
      ) : (
        <span className={`inline-flex items-center ${className ?? ""}`}>
          <IconButton
            aria-label={`Show the MongoDB behind: ${entry.title}`}
            title="See the MongoDB behind this"
            size={size}
            darkMode={darkMode}
            active={open}
            onClick={openModal}
          >
            <Icon glyph="CurlyBraces" />
          </IconButton>
        </span>
      )}

      <Modal
        open={open}
        setOpen={setOpen}
        size="large"
        initialFocus={contentRef as RefObject<HTMLElement>}
        className="mx-auto max-w-full overflow-hidden rounded-xl p-0 text-left max-md:w-[95vw] max-md:max-w-[95vw]"
      >
        <div
          ref={contentRef}
          tabIndex={-1}
          className="flex max-h-[85vh] min-h-0 flex-col overflow-hidden bg-white p-6 outline-none max-md:p-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="material-symbols-outlined text-[15px]">
                database
              </span>
              {entry.capability}
            </span>
          </div>

          <H3 className="mt-3 text-left !text-[22px] !leading-8 text-slate-900 max-md:!text-xl">
            {entry.title}
          </H3>

          <Body className="mt-2 !text-[15px] !leading-7 text-slate-600">
            {entry.summary}
          </Body>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            {snippets.length === 1 ? (
              <SnippetView snippet={snippets[0]} />
            ) : (
              <Tabs
                aria-label={`${entry.title} snippets`}
                value={selected}
                onValueChange={setSelected}
              >
                {snippets.map((snippet, index) => (
                  <Tab key={`${snippet.label}-${index}`} name={snippet.label}>
                    <div className="pt-3">
                      <SnippetView snippet={snippet} />
                    </div>
                  </Tab>
                ))}
              </Tabs>
            )}
          </div>

          {entry.docsUrl ? (
            <a
              href={entry.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
            >
              {entry.docsLabel ?? "Learn more"}
              <span className="material-symbols-outlined text-[15px]">
                open_in_new
              </span>
            </a>
          ) : null}
        </div>
      </Modal>
    </>
  );
}

function SnippetView({ snippet }: { snippet: SpotlightSnippet }) {
  if (snippet.hint) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-4 text-emerald-800">
        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">
          bolt
        </span>
        <p className="text-[14px] leading-6">{snippet.hint}</p>
      </div>
    );
  }

  return (
    <div>
      {snippet.caption ? (
        <p className="mb-2 text-[13px] leading-6 text-slate-500">
          {snippet.caption}
        </p>
      ) : null}
      <Code language={snippet.language} copyButtonAppearance="persist">
        {snippet.code}
      </Code>

      {snippet.live ? (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            {snippet.live.label} — straight from this dashboard
          </p>
          {snippet.live.hint ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-4 py-4 text-emerald-800">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">
                bolt
              </span>
              <p className="text-[14px] leading-6">{snippet.live.hint}</p>
            </div>
          ) : (
            <Code language="json" copyButtonAppearance="persist">
              {snippet.live.code ?? ""}
            </Code>
          )}
        </div>
      ) : null}
    </div>
  );
}
