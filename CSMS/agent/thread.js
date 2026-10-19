"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadConfig = threadConfig;
exports.historyWindow = historyWindow;
exports.discardIncompleteTurn = discardIncompleteTurn;
exports.runTurn = runTurn;
const messages_1 = require("@langchain/core/messages");
// Rough budget for the history replayed to the model on each turn. The full
// thread stays in the checkpoint; this only bounds what a single call sees.
const HISTORY_TOKEN_BUDGET = 100_000;
// Scoping the thread by audience and user means a guessed threadId cannot
// read another user's conversation.
function threadConfig(audience, userId, threadId) {
    return { configurable: { thread_id: `${audience}:${userId}:${threadId}` } };
}
function approximateTokens(messages) {
    const chars = messages.reduce((total, message) => {
        const toolCalls = messages_1.AIMessage.isInstance(message) ? message.tool_calls : [];
        return (total +
            JSON.stringify(message.content).length +
            (toolCalls?.length ? JSON.stringify(toolCalls).length : 0));
    }, 0);
    return Math.ceil(chars / 4);
}
// Keeps whole turns (never a tool result without its call) and always starts
// on a user message, which is what the model API requires.
async function historyWindow(messages) {
    const window = await (0, messages_1.trimMessages)(messages, {
        maxTokens: HISTORY_TOKEN_BUDGET,
        tokenCounter: approximateTokens,
        strategy: "last",
        startOn: "human"
    });
    if (window.length)
        return window;
    let lastHuman = messages.length - 1;
    while (lastHuman > 0 && messages[lastHuman].type !== "human")
        lastHuman--;
    return messages.slice(Math.max(lastHuman, 0));
}
// A turn that failed part-way (model error, timeout) leaves its user message,
// and possibly a tool call without a result, at the end of the thread.
// Dropping that tail lets the user retry without a broken conversation.
async function discardIncompleteTurn(graph, config) {
    const { values } = await graph.getState(config);
    const messages = values.messages ?? [];
    let keep = messages.length;
    while (keep > 0) {
        const last = messages[keep - 1];
        if (messages_1.AIMessage.isInstance(last) && !last.tool_calls?.length)
            break;
        keep--;
    }
    const dangling = messages.slice(keep).filter((m) => m.id);
    if (!dangling.length)
        return;
    console.warn("[Agent] Discarding incomplete turn", { messages: dangling.length });
    await graph.updateState(config, { messages: dangling.map((m) => new messages_1.RemoveMessage({ id: m.id })) }, "respond");
}
async function runTurn(graph, config, message, recursionLimit) {
    try {
        const result = await graph.invoke({ messages: [new messages_1.HumanMessage(message)] }, { ...config, recursionLimit });
        const last = result.messages.at(-1);
        if (!last || !messages_1.AIMessage.isInstance(last) || !last.text.trim()) {
            throw new Error("Agent returned no text");
        }
        return last.text;
    }
    catch (error) {
        await discardIncompleteTurn(graph, config).catch((cleanupError) => console.error("[Agent] Could not roll back failed turn", cleanupError));
        throw error;
    }
}
