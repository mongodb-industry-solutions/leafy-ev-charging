import {
	END, START, StateGraph, StateSchema, MessagesValue
} from "@langchain/langgraph";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { chatModel } from "../config";
import { getCheckpointer } from "../checkpointer";
import {
  historyWindow,
  runTurn,
  threadConfig,
  type ChatTurn
} from "../thread";
import { SYSTEM_PROMPT } from "./prompt";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { Db } from "mongodb";
import { createOperatorTools } from "./toolNode";

const State = new StateSchema({ messages: MessagesValue });

export async function runOperator(
  turn: ChatTurn,
  userId: string,
  db: Db
): Promise<string> {
  const tools = createOperatorTools(db);
  const toolNode = new ToolNode(tools);
  const model = chatModel.bindTools(tools);
  const system = new SystemMessage(
    `${SYSTEM_PROMPT}\nCurrent server time (UTC): ${new Date().toISOString()}.`
  );

  const graph = new StateGraph(State)
    .addNode("respond", async (state) => ({
      messages: [await model.invoke([system, ...(await historyWindow(state.messages))])]
    }))
    .addNode("tools", async (state) => toolNode.invoke(state))
    .addEdge(START, "respond")
    .addConditionalEdges("respond", (state) => {
      const last = state.messages.at(-1);
      return last && AIMessage.isInstance(last) && last.tool_calls?.length
        ? "tools"
        : END;
    }, ["tools", END])
    .addEdge("tools", "respond")
    .compile({ checkpointer: await getCheckpointer(db) });

  return runTurn(graph, threadConfig("OPERATOR", userId, turn.threadId), turn.message);
}
