import {
  AIMessage,
  HumanMessage,
  RemoveMessage,
  trimMessages,
  type BaseMessage
} from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

export type ChatTurn = {
  threadId: string;
  message: string;
};

// Rough budget for the history replayed to the model on each turn. The full
// thread stays in the checkpoint; this only bounds what a single call sees.
const HISTORY_TOKEN_BUDGET = 100_000;

// Scoping the thread by audience and user means a guessed threadId cannot
// read another user's conversation.
export function threadConfig(
  audience: string,
  userId: string,
  threadId: string
): RunnableConfig {
  return { configurable: { thread_id: `${audience}:${userId}:${threadId}` } };
}

function approximateTokens(messages: BaseMessage[]): number {
  const chars = messages.reduce((total, message) => {
    const toolCalls = AIMessage.isInstance(message) ? message.tool_calls : [];
    return (
      total +
      JSON.stringify(message.content).length +
      (toolCalls?.length ? JSON.stringify(toolCalls).length : 0)
    );
  }, 0);
  return Math.ceil(chars / 4);
}

// Keeps whole turns (never a tool result without its call) and always starts
// on a user message, which is what the model API requires.
export async function historyWindow(
  messages: BaseMessage[]
): Promise<BaseMessage[]> {
  const window = await trimMessages(messages, {
    maxTokens: HISTORY_TOKEN_BUDGET,
    tokenCounter: approximateTokens,
    strategy: "last",
    startOn: "human"
  });
  if (window.length) return window;

  let lastHuman = messages.length - 1;
  while (lastHuman > 0 && messages[lastHuman].type !== "human") lastHuman--;
  return messages.slice(Math.max(lastHuman, 0));
}

type ThreadGraph = {
  getState(config: RunnableConfig): Promise<{ values: { messages?: BaseMessage[] } }>;
  updateState(
    config: RunnableConfig,
    values: { messages: RemoveMessage[] },
    asNode?: string
  ): Promise<unknown>;
};

// A turn that failed part-way (model error, timeout) leaves its user message,
// and possibly a tool call without a result, at the end of the thread.
// Dropping that tail lets the user retry without a broken conversation.
export async function discardIncompleteTurn(
  graph: ThreadGraph,
  config: RunnableConfig
): Promise<void> {
  const { values } = await graph.getState(config);
  const messages = values.messages ?? [];

  let keep = messages.length;
  while (keep > 0) {
    const last = messages[keep - 1];
    if (AIMessage.isInstance(last) && !last.tool_calls?.length) break;
    keep--;
  }

  const dangling = messages.slice(keep).filter((m) => m.id);
  if (!dangling.length) return;

  console.warn("[Agent] Discarding incomplete turn", { messages: dangling.length });
  await graph.updateState(
    config,
    { messages: dangling.map((m) => new RemoveMessage({ id: m.id as string })) },
    "respond"
  );
}

type TurnGraph = ThreadGraph & {
  invoke(
    input: { messages: HumanMessage[] },
    config: RunnableConfig
  ): Promise<{ messages: BaseMessage[] }>;
};

export async function runTurn(
  graph: TurnGraph,
  config: RunnableConfig,
  message: string,
  recursionLimit?: number
): Promise<string> {
  try {
    const result = await graph.invoke(
      { messages: [new HumanMessage(message)] },
      { ...config, recursionLimit }
    );
    const last = result.messages.at(-1);
    if (!last || !AIMessage.isInstance(last) || !last.text.trim()) {
      throw new Error("Agent returned no text");
    }
    return last.text;
  } catch (error) {
    await discardIncompleteTurn(graph, config).catch((cleanupError) =>
      console.error("[Agent] Could not roll back failed turn", cleanupError)
    );
    throw error;
  }
}
