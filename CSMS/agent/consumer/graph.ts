import {
  END, START, StateGraph, StateSchema, MessagesValue
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { Db } from "mongodb";
import { SYSTEM_PROMPT } from "./prompt";
import { chatModel } from "../config";
import { createConsumerTools } from "./toolNode";

export type ChatInput = {
  role: "USER" | "ASSISTANT";
  content: string;
};

export type ConsumerContext = {
  db: Db;
  authenticatedUserId: string;
};

const State = new StateSchema({ messages: MessagesValue });

export async function runConsumer(
  messages: ChatInput[],
  context: ConsumerContext
): Promise<string> {
  const tools = createConsumerTools(context.db, context.authenticatedUserId);
  const toolNode = new ToolNode(tools);
  const model = chatModel.bindTools(tools);
  const system = new SystemMessage(SYSTEM_PROMPT);

  console.log("[Agent] Starting", {
    messageCount: messages.length,
    tools: tools.map((tool) => tool.name)
  });

  const graph = new StateGraph(State)
    .addNode("respond", async (state) => {
      console.log("[Agent] Calling model");

      const response = await model.invoke([system, ...state.messages]);

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
          name: message.name,
          content: message.content
        });
      }

      return result;
    })
    .addEdge(START, "respond")
    .addConditionalEdges("respond", (state) => {
      const last = state.messages.at(-1);
      return last && AIMessage.isInstance(last) && last.tool_calls?.length
        ? "tools" : END;
    }, ["tools", END])
    .addEdge("tools", "respond")
    .compile();

  try {
    const result = await graph.invoke({
      messages: messages.map((message) =>
        message.role === "USER"
          ? new HumanMessage(message.content)
          : new AIMessage(message.content)
      )
    }, { recursionLimit: 12 });

    const last = result.messages.at(-1);
    if (!last || !AIMessage.isInstance(last) || !last.text.trim()) {
      throw new Error("Agent returned no text");
    }
    return last.text;
  } catch (error) {
    console.error("[Agent] Execution failed", error);
    throw error;
  }
}