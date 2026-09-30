import {
	END, START, StateGraph, StateSchema, MessagesValue
} from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { chatModel } from "../config";
import type { ChatInput } from "../consumer/graph";
import { SYSTEM_PROMPT } from "./prompt";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import type { Db } from "mongodb";
import { createOperatorTools } from "./toolNode";

const State = new StateSchema({ messages: MessagesValue });

export async function runOperator(
  messages: ChatInput[],
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
      messages: [await model.invoke([system, ...state.messages])]
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
    .compile();

  const result = await graph.invoke({
    messages: messages.map((message) =>
      message.role === "USER"
        ? new HumanMessage(message.content)
        : new AIMessage(message.content)
    )
  });

	const last = result.messages.at(-1);
	if (!last || !AIMessage.isInstance(last) || !last.text.trim()) {
		throw new Error("Agent returned no text");
	}
	return last.text;
}
