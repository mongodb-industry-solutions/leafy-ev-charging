import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema
} from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { chatModel } from "../config";

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

export async function run(prompt: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(prompt)]
  });

  return result.messages.at(-1)?.content;
}