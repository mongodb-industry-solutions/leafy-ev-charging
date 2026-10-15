"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConsumer = runConsumer;
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const messages_1 = require("@langchain/core/messages");
const prompt_1 = require("./prompt");
const config_1 = require("../config");
const checkpointer_1 = require("../checkpointer");
const thread_1 = require("../thread");
const toolNode_1 = require("./toolNode");
const State = new langgraph_1.StateSchema({ messages: langgraph_1.MessagesValue });
async function runConsumer(turn, context) {
    const tools = (0, toolNode_1.createConsumerTools)(context.db, context.authenticatedUserId);
    const toolNode = new prebuilt_1.ToolNode(tools);
    const model = (0, config_1.getChatModel)().bindTools(tools);
    const now = new Date();
    const recentFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const locationContext = context.location
        ? `The user's map is currently centered at latitude ${context.location.latitude}, longitude ${context.location.longitude}. ` +
            `Treat these coordinates as internal context only: use them as the search center for proximity questions ` +
            `("near me", "around here", "close by") when the user supplies no coordinates, and never state or quote them in your reply.\n`
        : "";
    const system = new messages_1.SystemMessage(`${prompt_1.SYSTEM_PROMPT}\n\n` +
        `Current server time (UTC): ${now.toISOString()}.\n` +
        locationContext +
        `For recent charging history without an explicit date range, use ` +
        `from="${recentFrom.toISOString()}" and to="${now.toISOString()}". ` +
        `This is the default last-30-days window; tell the user the period searched. ` +
        `Honor explicit user-requested dates instead. Never assume a year from training data. ` +
        `An empty result only means no matches for the supplied filters and period, ` +
        `not that the user has never charged.`);
    console.log("[Agent] Starting", {
        threadId: turn.threadId,
        tools: tools.map((tool) => tool.name)
    });
    const graph = new langgraph_1.StateGraph(State)
        .addNode("respond", async (state) => {
        console.log("[Agent] Calling model");
        const history = await (0, thread_1.historyWindow)(state.messages);
        const response = await model.invoke([system, ...history]);
        for (const call of response.tool_calls ?? []) {
            console.log("[Agent] Requested tool", {
                id: call.id,
                name: call.name,
                arguments: call.args
            });
        }
        if (!response.tool_calls?.length) {
            console.log("[Agent] Final answer:", response.text);
        }
        return { messages: [response] };
    })
        .addNode("tools", async (state) => {
        console.log("[Agent] Executing tools");
        const result = await toolNode.invoke(state);
        for (const message of result.messages) {
            console.log("[Agent] Tool result", {
                name: message.name
            });
        }
        return result;
    })
        .addEdge(langgraph_1.START, "respond")
        .addConditionalEdges("respond", (state) => {
        const last = state.messages.at(-1);
        return last && messages_1.AIMessage.isInstance(last) && last.tool_calls?.length
            ? "tools" : langgraph_1.END;
    }, ["tools", langgraph_1.END])
        .addEdge("tools", "respond")
        .compile({ checkpointer: await (0, checkpointer_1.getCheckpointer)(context.db) });
    try {
        return await (0, thread_1.runTurn)(graph, (0, thread_1.threadConfig)("DRIVER", context.authenticatedUserId, turn.threadId), turn.message, 12);
    }
    catch (error) {
        console.error("[Agent] Execution failed", error);
        throw error;
    }
}
