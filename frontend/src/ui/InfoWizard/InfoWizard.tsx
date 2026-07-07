"use client";

import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import Modal from "@leafygreen-ui/modal";
import { Tab, Tabs } from "@leafygreen-ui/tabs";
import { Body, H3 } from "@leafygreen-ui/typography";
import Image from "next/image";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

const noopSubscribe = () => () => {};

interface InfoWizardImage {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
}

interface InfoWizardSubList {
  heading: string;
  body: string[];
}

interface InfoWizardSection {
  heading?: string;
  body?: string | Array<string | InfoWizardSubList>;
  image?: InfoWizardImage;
  ordered?: boolean;
}

interface InfoWizardTab {
  heading: string;
  content: InfoWizardSection[];
}

interface InfoWizardProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tooltipText?: string;
  iconGlyph?: string;
  sections?: InfoWizardTab[];
}

export function InfoWizard({
  open,
  setOpen,
  iconGlyph = "Wizard",
  sections = [],
}: InfoWizardProps) {
  const [selected, setSelected] = useState(0);
  const [expandedImage, setExpandedImage] = useState<InfoWizardImage | null>(
    null
  );
  // Only portal after mount so SSR and the client's first render agree (both
  // render nothing), avoiding a hydration mismatch on the portalled <dialog>.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const expandedImageDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!expandedImage) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpandedImage(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expandedImage]);

  useEffect(() => {
    const dialog = expandedImageDialogRef.current;
    if (!dialog) return;

    if (expandedImage && !dialog.open) {
      dialog.showModal();
    } else if (!expandedImage && dialog.open) {
      dialog.close();
    }
  }, [expandedImage]);

  const renderText = (text: string) => {
    const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <a
          key={`${match[2]}-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderBody = (
    body: InfoWizardSection["body"],
    options?: { ordered?: boolean }
  ) => {
    if (!body) return null;

    if (!Array.isArray(body)) {
      return (
        <Body className="mt-3 !text-[17px] !leading-8 text-slate-600">
          {renderText(body)}
        </Body>
      );
    }

    return (
      <div className="mt-3 space-y-4">
        {body.map((item, idx) =>
          typeof item === "object" ? (
            <div key={idx} className="border-l-2 border-emerald-500 pl-4">
              <p className="text-[17px] font-semibold leading-7 text-slate-900">
                {item.heading}
              </p>
              <div className="mt-2 space-y-2">
                {item.body.map((subItem, subIdx) => (
                  <Body
                    key={subIdx}
                    className="!text-[17px] !leading-8 text-slate-600"
                  >
                    {renderText(subItem)}
                  </Body>
                ))}
              </div>
            </div>
          ) : (
            <Body
              key={idx}
              className="!text-[17px] !leading-8 text-slate-600"
            >
              {options?.ordered ? (
                <span className="flex gap-3">
                  <span className="shrink-0 font-semibold text-emerald-700">
                    {idx + 1}.
                  </span>
                  <span>{renderText(item)}</span>
                </span>
              ) : (
                renderText(item)
              )}
            </Body>
          )
        )}
      </div>
    );
  };

  const renderImage = (image: InfoWizardImage) => (
    <button
      type="button"
      onClick={() => setExpandedImage(image)}
      className="group relative my-5 block h-[400px] w-full overflow-hidden bg-transparent transition max-md:h-[250px]"
      style={{ marginLeft: 0, marginRight: 0 }}
      aria-label={`Expand ${image.alt}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        className="p-0"
        priority={image.priority || false}
        quality={image.quality || 75}
        fill
        style={{ objectFit: "contain" }}
      />
      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 opacity-0 shadow-sm ring-1 ring-slate-200 transition group-hover:opacity-100">
        <svg
          aria-hidden
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"
          />
        </svg>
      </span>
    </button>
  );

  const expandedImageOverlay =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <dialog
            ref={expandedImageDialogRef}
            aria-label={expandedImage?.alt ?? "Expanded image"}
            className="m-auto h-[88vh] w-[92vw] max-w-none overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm"
            onCancel={(event) => {
              event.preventDefault();
              setExpandedImage(null);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setExpandedImage(null);
            }}
          >
            {expandedImage && (
              <div className="relative h-full w-full">
                <Image
                  src={expandedImage.src}
                  alt={expandedImage.alt}
                  className="p-5"
                  priority={expandedImage.priority || false}
                  quality={expandedImage.quality || 75}
                  fill
                  style={{ objectFit: "contain" }}
                />
                <button
                  type="button"
                  onClick={() => setExpandedImage(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50"
                  aria-label="Collapse image"
                >
                  <Icon glyph="X" />
                </button>
              </div>
            )}
          </dialog>,
          document.body
        )
      : null;

  return (
    <>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        leftGlyph={<Icon glyph={iconGlyph} />}
      >
        Tell me more!
      </Button>

      <Modal
        open={open}
        setOpen={setOpen}
        size="large"
        className="mx-auto max-w-full overflow-hidden rounded-xl p-0 text-left max-md:w-[95vw] max-md:max-w-[95vw]"
      >
        <div className="flex h-[640px] max-h-[90vh] min-h-[500px] flex-col overflow-hidden bg-white p-6 max-md:h-auto max-md:max-h-[80vh] max-md:min-h-0 max-md:p-4">
          <Tabs
            aria-label="info wizard tabs"
            value={selected}
            onValueChange={setSelected}
            className="flex min-h-0 flex-1 flex-col [&>div:last-child]:min-h-0 [&>div:last-child]:flex-1 [&>div:last-child]:overflow-y-auto [&>div:last-child]:pr-2 [&>div:last-child]:pt-3 [&>div:last-child]:[scrollbar-color:#cbd5e1_transparent] [&>div:last-child]:[scrollbar-width:thin]"
          >
            {sections.map((tab, tabIndex) => (
              <Tab key={tabIndex} name={tab.heading}>
                {tab.content.map((section, sectionIndex) => (
                  <section
                    key={sectionIndex}
                    className={
                      section.image && !section.heading && !section.body
                        ? ""
                        : "mb-6 pb-2"
                    }
                  >
                    {section.heading && (
                      <H3 className="text-left !text-[22px] !leading-8 text-slate-900 max-md:!text-xl">
                        {section.heading}
                      </H3>
                    )}

                    {renderBody(section.body, { ordered: section.ordered })}

                    {section.image && renderImage(section.image)}
                  </section>
                ))}
              </Tab>
            ))}
          </Tabs>
        </div>
      </Modal>

      {expandedImageOverlay}
    </>
  );
}
