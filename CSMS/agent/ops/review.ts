import {
  END,
  START,
  StateGraph,
  StateSchema,
  MessagesValue
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import type { BaseMessage } from "@langchain/core/messages";
import type { Db } from "mongodb";
import { chatModel } from "../config";
import { createOperatorTools } from "./toolNode";

export type IncidentReviewInput = {
  stationId: string;
  description: string;
};

export type IncidentReviewDisposition =
  | "AUTO_RESOLVED"
  | "MAINTENANCE_SCHEDULED";

export type IncidentReviewReport = {
  summary: string;
  likelyCause: string;
  solution: string;
  disposition: IncidentReviewDisposition;
  scheduledFor?: string;
  nextStep: string;
  confidence: "low" | "medium" | "high";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  manualReferences: Array<{ section: string; codes: string[] }>;
  pastIncidents: string[];
  estimatedRepairTime: string;
  reasoning: string;
};

export type ToolUsage = {
  tool: string;
  input: unknown;
  result: string | null;
};

export type IncidentReviewResult = IncidentReviewReport & {
  toolsUsed: ToolUsage[];
};

const REVIEW_REPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: {
      type: "string",
      description: "One or two sentences describing the problem and its impact."
    },
    likelyCause: {
      type: "string",
      description: "The most likely root cause, grounded in the evidence."
    },
    solution: {
      type: "string",
      description:
        "The recommended fix that resolves the root cause. This is the headline solution for the operator."
    },
    disposition: {
      type: "string",
      enum: ["AUTO_RESOLVED", "MAINTENANCE_SCHEDULED"],
      description:
        "AUTO_RESOLVED when a remote action the platform can perform fixes it; MAINTENANCE_SCHEDULED when it needs a crew."
    },
    scheduledFor: {
      type: "string",
      description:
        "ISO 8601 date/time you schedule the maintenance crew for, when disposition is MAINTENANCE_SCHEDULED. Invent a realistic future time. Omit for AUTO_RESOLVED."
    },
    nextStep: {
      type: "string",
      description:
        "A single administrative action for the operator, e.g. 'Schedule a maintenance visit' or 'Approve the remote restart'. No technical steps."
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    severity: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    },
    manualReferences: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          section: { type: "string" },
          codes: { type: "array", items: { type: "string" } }
        },
        required: ["section", "codes"]
      }
    },
    pastIncidents: {
      type: "array",
      items: { type: "string" },
      description: "Relevant past incidents at this station and how they were resolved."
    },
    estimatedRepairTime: {
      type: "string",
      description: "Estimated time to resolve, e.g. '2 days' or 'remote, immediate'."
    },
    reasoning: {
      type: "string",
      description: "How the evidence led to this conclusion."
    }
  },
  required: [
    "summary",
    "likelyCause",
    "solution",
    "disposition",
    "nextStep",
    "confidence",
    "severity",
    "manualReferences",
    "pastIncidents",
    "estimatedRepairTime",
    "reasoning"
  ]
} as const;

const submitIncidentReview = tool(
  async (report: IncidentReviewReport) => JSON.stringify(report),
  {
    name: "submitIncidentReview",
    description:
      "Submit the final incident review as structured JSON. Call this exactly once, when you have enough evidence.",
    schema: REVIEW_REPORT_SCHEMA
  }
);

function buildReviewPrompt(input: IncidentReviewInput): string {
  return [
    "You are the LeafyCharge incident review agent.",
    "You are given a charging station and a problem description. Investigate and produce one structured incident report.",
    "",
    "Use the tools to gather evidence before concluding:",
    "- getSelectedChargerDetails: the station, its charging points, connectors, and availability.",
    "- skimTelemetry: recent power/voltage/current and samples for the station, point, or session.",
    "- summarizeStationIncidents: past incidents at this station, including how they were resolved. Look for repeat problems.",
    "- searchManuals: the equipment manual. Use the symptom and any error codes (e.g. E-05, W-204, N-403) to find relevant sections and repair steps.",
    "",
    "Decide the disposition:",
    "- AUTO_RESOLVED when a remote action the platform can perform fixes it: restart the charging point / EVSE, restart the payment terminal, reboot the controller or re-initialize the OCPP connection, retry or cancel a stuck transaction, adjust a power/current limit.",
    "- MAINTENANCE_SCHEDULED when it needs a crew: physical inspection, opening the enclosure, replacing cables/connectors/contactors or other hardware, firmware/hardware replacement, site safety or electrical checks.",
    "",
    "Write `solution`: the fix that resolves the root cause, in one or two plain sentences.",
    "Write `nextStep`: exactly ONE administrative action for the operator, for example 'Schedule a maintenance visit', 'Approve the remote restart', or 'Dispatch a crew to inspect the connector'. The operator does not need technical steps; keep it administrative and actionable.",
    "When the disposition is MAINTENANCE_SCHEDULED, you are scheduling the crew: invent a realistic future date and time and put it in `scheduledFor` as an ISO 8601 timestamp (for example 2026-10-06T09:00:00.000Z). It is a proposal, not a guarantee. Omit `scheduledFor` for AUTO_RESOLVED.",
    "Ground every claim in tool results. Cite the manual sections you used in manualReferences. Do not invent facts.",
    `Station: ${input.stationId}`,
    `Problem: ${input.description}`,
    "",
    "When you have enough evidence, call submitIncidentReview exactly once with the JSON report."
  ].join("\n");
}

function findSubmittedReport(
  messages: BaseMessage[]
): IncidentReviewReport | null {
  for (const message of messages) {
    if (!AIMessage.isInstance(message)) continue;
    for (const call of message.tool_calls ?? []) {
      if (call.name === "submitIncidentReview") {
        return call.args as IncidentReviewReport;
      }
    }
  }
  return null;
}

function extractToolsUsed(messages: BaseMessage[]): ToolUsage[] {
  const results = new Map<string, string>();
  for (const message of messages) {
    if (ToolMessage.isInstance(message)) {
      const content =
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content);
      results.set(message.tool_call_id, content);
    }
  }

  const used: ToolUsage[] = [];
  for (const message of messages) {
    if (!AIMessage.isInstance(message)) continue;
    for (const call of message.tool_calls ?? []) {
      if (call.name === "submitIncidentReview") continue;
      used.push({
        tool: call.name,
        input: call.args,
        result: results.get(call.id ?? "") ?? null
      });
    }
  }
  return used;
}

const State = new StateSchema({ messages: MessagesValue });

export async function runIncidentReview(
  db: Db,
  input: IncidentReviewInput
): Promise<IncidentReviewResult> {
  const tools = [...createOperatorTools(db), submitIncidentReview];
  const toolNode = new ToolNode(tools);
  const model = chatModel.bindTools(tools);
  const system = new SystemMessage(buildReviewPrompt(input));

  const graph = new StateGraph(State)
    .addNode("respond", async (state) => ({
      messages: [await model.invoke([system, ...state.messages])]
    }))
    .addNode("tools", async (state) => toolNode.invoke(state))
    .addEdge(START, "respond")
    .addConditionalEdges(
      "respond",
      (state) => {
        const last = state.messages.at(-1);
        if (last && AIMessage.isInstance(last) && last.tool_calls?.length) {
          return last.tool_calls.some(
            (call) => call.name === "submitIncidentReview"
          )
            ? END
            : "tools";
        }
        return END;
      },
      ["tools", END]
    )
    .addEdge("tools", "respond")
    .compile();

  const result = await graph.invoke(
    {
      messages: [
        new HumanMessage(
          `Review this incident.\nStation: ${input.stationId}\nProblem: ${input.description}`
        )
      ]
    },
    { recursionLimit: 12 }
  );

  const report = findSubmittedReport(result.messages);
  if (!report) {
    throw new Error("Incident review did not produce a report");
  }

  return { ...report, toolsUsed: extractToolsUsed(result.messages) };
}
