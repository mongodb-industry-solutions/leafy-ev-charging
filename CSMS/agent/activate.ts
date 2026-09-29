import {
  runConsumer,
  type ChatInput,
  type ConsumerContext
} from "./consumer/graph";

type ActivateAgentInput = {
  audience: "DRIVER" | "OPERATOR";
  messages: ChatInput[];
  context: ConsumerContext;
};

export async function activateAgent({
  audience,
  messages,
  context
}: ActivateAgentInput): Promise<string> {
  switch (audience) {
    case "DRIVER":
      return runConsumer(messages, context);
    case "OPERATOR":
      throw new Error("Operator agent is not implemented yet");
    default:
      throw new Error("Unsupported agent audience");
  }
}