"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIncidentReview = runIncidentReview;
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("@langchain/core/tools");
const config_1 = require("../config");
const toolNode_1 = require("./toolNode");
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
            description: "The recommended fix that resolves the root cause. This is the headline solution for the operator."
        },
        disposition: {
            type: "string",
            enum: ["AUTO_RESOLVED", "MAINTENANCE_SCHEDULED"],
            description: "AUTO_RESOLVED when a remote action the platform can perform fixes it; MAINTENANCE_SCHEDULED when it needs a crew."
        },
        scheduledFor: {
            type: "string",
            description: "ISO 8601 date/time you schedule the maintenance crew for, when disposition is MAINTENANCE_SCHEDULED. Invent a realistic future time. Omit for AUTO_RESOLVED."
        },
        nextStep: {
            type: "string",
            description: "A single administrative action for the operator, e.g. 'Schedule a maintenance visit' or 'Approve the remote restart'. No technical steps."
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
};
const submitIncidentReview = (0, tools_1.tool)(async (report) => JSON.stringify(report), {
    name: "submitIncidentReview",
    description: "Submit the final incident review as structured JSON. Call this exactly once, when you have enough evidence.",
    schema: REVIEW_REPORT_SCHEMA
});
function buildReviewPrompt(input) {
    const now = new Date().toISOString();
    const incidentTimeLine = input.incidentAt
        ? `The incident was recorded at ${input.incidentAt}.`
        : "Treat the current time as the incident time.";
    return [
        "You are the LeafyCharge incident review agent.",
        "You are given a charging station and a problem description. Investigate and produce one structured incident report.",
        `Current server time (UTC): ${now}.`,
        incidentTimeLine,
        "When you call skimTelemetry, use a time window around the incident time (for example 30 minutes before to 30 minutes after it). Do not guess a year or an unrelated date; use the times given here.",
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
function findSubmittedReport(messages) {
    for (const message of messages) {
        if (!messages_1.AIMessage.isInstance(message))
            continue;
        for (const call of message.tool_calls ?? []) {
            if (call.name === "submitIncidentReview") {
                return call.args;
            }
        }
    }
    return null;
}
function extractToolsUsed(messages) {
    const results = new Map();
    for (const message of messages) {
        if (messages_1.ToolMessage.isInstance(message)) {
            const content = typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content);
            results.set(message.tool_call_id, content);
        }
    }
    const used = [];
    for (const message of messages) {
        if (!messages_1.AIMessage.isInstance(message))
            continue;
        for (const call of message.tool_calls ?? []) {
            if (call.name === "submitIncidentReview")
                continue;
            used.push({
                tool: call.name,
                input: call.args,
                result: results.get(call.id ?? "") ?? null
            });
        }
    }
    return used;
}
const State = new langgraph_1.StateSchema({ messages: langgraph_1.MessagesValue });
async function runIncidentReview(db, input) {
    const tools = [...(0, toolNode_1.createOperatorTools)(db), submitIncidentReview];
    const toolNode = new prebuilt_1.ToolNode(tools);
    const model = (0, config_1.getChatModel)().bindTools(tools);
    const system = new messages_1.SystemMessage(buildReviewPrompt(input));
    const graph = new langgraph_1.StateGraph(State)
        .addNode("respond", async (state) => ({
        messages: [await model.invoke([system, ...state.messages])]
    }))
        .addNode("tools", async (state) => toolNode.invoke(state))
        .addEdge(langgraph_1.START, "respond")
        .addConditionalEdges("respond", (state) => {
        const last = state.messages.at(-1);
        if (last && messages_1.AIMessage.isInstance(last) && last.tool_calls?.length) {
            return last.tool_calls.some((call) => call.name === "submitIncidentReview")
                ? langgraph_1.END
                : "tools";
        }
        return langgraph_1.END;
    }, ["tools", langgraph_1.END])
        .addEdge("tools", "respond")
        .compile();
    const result = await graph.invoke({
        messages: [
            new messages_1.HumanMessage(`Review this incident.\nStation: ${input.stationId}\nProblem: ${input.description}`)
        ]
    }, { recursionLimit: 12 });
    const report = findSubmittedReport(result.messages);
    if (!report) {
        throw new Error("Incident review did not produce a report");
    }
    return { ...report, toolsUsed: extractToolsUsed(result.messages) };
}
