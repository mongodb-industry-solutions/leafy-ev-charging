import {
  END, START, StateGraph, StateSchema, MessagesValue
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import type { Db } from "mongodb";
import { SYSTEM_PROMPT } from "./prompt";
import { getChatModel } from "../config";
import { getCheckpointer } from "../checkpointer";
import {
  historyWindow,
  runTurn,
  threadConfig,
  type ChatTurn
} from "../thread";
import { createConsumerTools } from "./toolNode";

export type ConsumerContext = {
  db: Db;
  authenticatedUserId: string;
  location?: { latitude: number; longitude: number };
};

const State = new StateSchema({ messages: MessagesValue });

export async function runConsumer(
  turn: ChatTurn,
  context: ConsumerContext
): Promise<string> {
  const tools = createConsumerTools(context.db, context.authenticatedUserId);
  const toolNode = new ToolNode(tools);
  const model = getChatModel().bindTools(tools);
  const now = new Date();
  const recentFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const locationContext = context.location
    ? `The user's map is currently centered at latitude ${context.location.latitude}, longitude ${context.location.longitude}. ` +
      `Treat these coordinates as internal context only: use them as the search center for proximity questions ` +
      `("near me", "around here", "close by") when the user supplies no coordinates, and never state or quote them in your reply.\n`
    : "";
  const system = new SystemMessage(
    `${SYSTEM_PROMPT}\n\n` +
    `Current server time (UTC): ${now.toISOString()}.\n` +
    locationContext +
    `For recent charging history without an explicit date range, use ` +
    `from="${recentFrom.toISOString()}" and to="${now.toISOString()}". ` +
    `This is the default last-30-days window; tell the user the period searched. ` +
    `Honor explicit user-requested dates instead. Never assume a year from training data. ` +
    `An empty result only means no matches for the supplied filters and period, ` +
    `not that the user has never charged.`
  );

  console.log("[Agent] Starting", {
    threadId: turn.threadId,
    tools: tools.map((tool) => tool.name)
  });

  const graph = new StateGraph(State)
    .addNode("respond", async (state) => {
      console.log("[Agent] Calling model");

      const history = await historyWindow(state.messages);
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
    .addEdge(START, "respond")
    .addConditionalEdges("respond", (state) => {
      const last = state.messages.at(-1);
      return last && AIMessage.isInstance(last) && last.tool_calls?.length
        ? "tools" : END;
    }, ["tools", END])
    .addEdge("tools", "respond")
    .compile({ checkpointer: await getCheckpointer(context.db) });

  try {
    return await runTurn(
      graph,
      threadConfig("DRIVER", context.authenticatedUserId, turn.threadId),
      turn.message,
      12
    );
  } catch (error) {
    console.error("[Agent] Execution failed", error);
    throw error;
  }
}