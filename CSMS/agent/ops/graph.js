"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOperator = runOperator;
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
const config_1 = require("../config");
const checkpointer_1 = require("../checkpointer");
const thread_1 = require("../thread");
const prompt_1 = require("./prompt");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const toolNode_1 = require("./toolNode");
const State = new langgraph_1.StateSchema({ messages: langgraph_1.MessagesValue });
async function runOperator(turn, userId, db) {
    const tools = (0, toolNode_1.createOperatorTools)(db);
    const toolNode = new prebuilt_1.ToolNode(tools);
    const model = (0, config_1.getChatModel)().bindTools(tools);
    const system = new messages_1.SystemMessage(`${prompt_1.SYSTEM_PROMPT}\nCurrent server time (UTC): ${new Date().toISOString()}.`);
    const graph = new langgraph_1.StateGraph(State)
        .addNode("respond", async (state) => ({
        messages: [await model.invoke([system, ...(await (0, thread_1.historyWindow)(state.messages))])]
    }))
        .addNode("tools", async (state) => toolNode.invoke(state))
        .addEdge(langgraph_1.START, "respond")
        .addConditionalEdges("respond", (state) => {
        const last = state.messages.at(-1);
        return last && messages_1.AIMessage.isInstance(last) && last.tool_calls?.length
            ? "tools"
            : langgraph_1.END;
    }, ["tools", langgraph_1.END])
        .addEdge("tools", "respond")
        .compile({ checkpointer: await (0, checkpointer_1.getCheckpointer)(db) });
    return (0, thread_1.runTurn)(graph, (0, thread_1.threadConfig)("OPERATOR", userId, turn.threadId), turn.message);
}
