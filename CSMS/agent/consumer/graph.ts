import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema
} from "@langchain/langgraph";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { chatModel } from "../config";

export type ChatInput = {
  role: "USER" | "ASSISTANT";
  content: string;
};

const State = new StateSchema({
  messages: MessagesValue
});

const graph = new StateGraph(State)
  .addNode("respond", async (state) => ({
    messages: [
      await chatModel.invoke([
        new SystemMessage("You are the LeafyCharge driver assistant."),
        ...state.messages
      ])
    ]
  }))
  .addEdge(START, "respond")
  .addEdge("respond", END)
  .compile();



export async function run(messages: ChatInput[]): Promise<string> {
  const result = await graph.invoke({
    messages: messages.map((message) =>
      message.role === "USER"
        ? new HumanMessage(message.content)
        : new AIMessage(message.content)
    )
  });

  const content = result.messages.at(-1)?.content;
  const reply = typeof content === "string"
    ? content
    : (content ?? [])
        .filter((block) => block.type === "text")
        .map((block) => String(block.text ?? ""))
        .join("");

  if (!reply.trim()) throw new Error("Agent returned no text");
  return reply;
}