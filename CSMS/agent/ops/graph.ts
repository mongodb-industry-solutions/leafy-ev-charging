import {
	END, START, StateGraph, StateSchema, MessagesValue
} from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { chatModel } from "../config";
import type { ChatInput } from "../consumer/graph";
import { SYSTEM_PROMPT } from "./prompt";

const State = new StateSchema({ messages: MessagesValue });

const graph = new StateGraph(State)
	.addNode("respond", async (state) => ({
		messages: [await chatModel.invoke([
			new SystemMessage(SYSTEM_PROMPT),
			...state.messages
		])]
	}))
	.addEdge(START, "respond")
	.addEdge("respond", END)
	.compile();

export async function runOperator(messages: ChatInput[]): Promise<string> {
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
