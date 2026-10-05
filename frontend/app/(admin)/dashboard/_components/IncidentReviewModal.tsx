"use client";

import type { ReactNode } from "react";

import { useQuery } from "@apollo/client/react";
import { CodeBlock, CodeSnippet } from "@via-ds/components/code-block";

import { Modal, ModalHeader } from "@/ui/Modal";
import { IncidentReviewDocument } from "@/graphql/generated/graphql";

type IncidentReviewModalProps = {
  incidentId: string;
  onClose: () => void;
};

type ToolUsage = {
  tool?: string;
  input?: unknown;
  result?: string | null;
};

type IncidentReview = {
  reviewedAt?: string;
  summary?: string;
  likelyCause?: string;
  solution?: string;
  disposition?: string;
  scheduledFor?: string;
  nextStep?: string;
  confidence?: string;
  severity?: string;
  manualReferences?: Array<{ section?: string; codes?: string[] }>;
  pastIncidents?: string[];
  estimatedRepairTime?: string;
  reasoning?: string;
  toolsUsed?: ToolUsage[];
};

function parseReview(value: string): IncidentReview | null {
  try {
    return JSON.parse(value) as IncidentReview;
  } catch {
    return null;
  }
}

function pretty(value: unknown): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function severityClasses(severity?: string): string {
  switch (severity) {
    case "CRITICAL":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "LOW":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function dispositionLabel(disposition?: string): string {
  switch (disposition) {
    case "AUTO_RESOLVED":
      return "Autoresolved";
    case "MAINTENANCE_SCHEDULED":
      return "Maintenance scheduled";
    default:
      return disposition ?? "Pending";
  }
}

function formatScheduled(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function dispositionClasses(disposition?: string): string {
  switch (disposition) {
    case "AUTO_RESOLVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "MAINTENANCE_SCHEDULED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${className ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}
    >
      {children}
    </span>
  );
}

function Collapsible({
  title,
  count,
  children
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3">
        <span
          className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-90"
          style={{ fontSize: 18 }}
        >
          chevron_right
        </span>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            {count}
          </span>
        )}
      </summary>
      <div className="border-t border-slate-100 px-4 py-3">{children}</div>
    </details>
  );
}

export function IncidentReviewModal({
  incidentId,
  onClose
}: IncidentReviewModalProps) {
  const { data, loading, error } = useQuery(IncidentReviewDocument, {
    variables: { incidentId },
    fetchPolicy: "network-only"
  });

  const raw = data?.incidentReview ?? null;
  const review = raw ? parseReview(raw) : null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      titleId="incident-review-title"
      maxWidth="xl"
    >
      <ModalHeader
        title="Incident review"
        titleId="incident-review-title"
        onClose={onClose}
      />
      
      <div className="max-h-[72vh] space-y-4 overflow-auto px-6 pb-6">
        {loading && <p className="text-sm text-slate-500">Loading review…</p>}

        {!loading && error && (
          <p className="text-sm text-rose-600">Could not load the review.</p>
        )}

        {!loading && !error && !raw && (
          <p className="text-sm text-slate-500">
            No review has been generated for this incident yet.
          </p>
        )}

        {!loading && !error && raw && !review && (
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
            {raw}
          </pre>
        )}
        {/* Didnt find a way to add padding */}
        <br /> 

        {review && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${dispositionClasses(review.disposition)}`}
              >
                {dispositionLabel(review.disposition)}
              </span>
              <Badge className={severityClasses(review.severity)}>
                {review.severity ?? "UNKNOWN"}
              </Badge>
              {review.confidence && (
                <Badge>confidence: {review.confidence}</Badge>
              )}
              {review.estimatedRepairTime && (
                <Badge>repair: {review.estimatedRepairTime}</Badge>
              )}
              {review.scheduledFor && formatScheduled(review.scheduledFor) && (
                <Badge className="bg-sky-50 text-sky-700 ring-sky-200">
                  scheduled: {formatScheduled(review.scheduledFor)}
                </Badge>
              )}
            </div>

            {review.solution && (
              <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <span
                  className="material-symbols-outlined mt-0.5 shrink-0 text-emerald-600"
                  style={{ fontSize: 20 }}
                >
                  verified
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Solution
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-900">
                    {review.solution}
                  </p>
                </div>
              </div>
            )}

            {review.nextStep && (
              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-4">
                <span
                  className="material-symbols-outlined mt-0.5 shrink-0 text-slate-500"
                  style={{ fontSize: 20 }}
                >
                  assignment_turned_in
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Next step for the operator
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {review.nextStep}
                  </p>
                </div>
              </div>
            )}

            {review.summary && (
              <section className="space-y-1">
                <Label>Summary</Label>
                <p className="text-sm text-slate-700">{review.summary}</p>
              </section>
            )}

            {review.likelyCause && (
              <section className="space-y-1">
                <Label>Likely cause</Label>
                <p className="text-sm text-slate-700">{review.likelyCause}</p>
              </section>
            )}

            {review.manualReferences && review.manualReferences.length > 0 && (
              <section className="space-y-2">
                <Label>Manual references</Label>
                <div className="space-y-1.5">
                  {review.manualReferences.map((reference, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600"
                    >
                      <span
                        className="material-symbols-outlined text-slate-400"
                        style={{ fontSize: 16 }}
                      >
                        menu_book
                      </span>
                      <span>{reference.section}</span>
                      {(reference.codes ?? []).map((code) => (
                        <span
                          key={code}
                          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Collapsible
              title="Past incidents"
              count={review.pastIncidents?.length ?? 0}
            >
              {review.pastIncidents && review.pastIncidents.length > 0 ? (
                <ul className="space-y-1.5">
                  {review.pastIncidents.map((item, index) => (
                    <li key={index} className="text-sm text-slate-600">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">No related past incidents.</p>
              )}
            </Collapsible>

            <Collapsible
              title="Tools used"
              count={review.toolsUsed?.length ?? 0}
            >
              {review.toolsUsed && review.toolsUsed.length > 0 ? (
                <div className="space-y-2">
                  {review.toolsUsed.map((usage, index) => (
                    <details
                      key={index}
                      className="group/tool rounded-lg border border-slate-100 bg-slate-50/60"
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2">
                        <span
                          className="material-symbols-outlined text-slate-400 transition-transform group-open/tool:rotate-90"
                          style={{ fontSize: 16 }}
                        >
                          chevron_right
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {usage.tool ?? "unknown"}
                        </span>
                      </summary>
                      <div className="space-y-2 border-t border-slate-100 px-3 py-2">
                        <div className="space-y-1">
                          <Label>Input</Label>
                          <CodeBlock language="json">
                            <CodeSnippet>{pretty(usage.input)}</CodeSnippet>
                          </CodeBlock>
                        </div>
                        <div className="space-y-1">
                          <Label>Result</Label>
                          <CodeBlock language="json">
                            <CodeSnippet>{pretty(usage.result)}</CodeSnippet>
                          </CodeBlock>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No tools were recorded.</p>
              )}
            </Collapsible>

            {review.reasoning && (
              <Collapsible title="Reasoning">
                <p className="whitespace-pre-wrap text-sm text-slate-600">
                  {review.reasoning}
                </p>
              </Collapsible>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
