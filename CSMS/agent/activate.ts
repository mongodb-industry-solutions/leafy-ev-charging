import { runConsumer, type ConsumerContext } from "./consumer/graph";
import { runOperator } from "./ops/graph";
import type { ChatTurn } from "./thread";

type ActivateAgentInput = {
  audience: "DRIVER" | "OPERATOR";
  turn: ChatTurn;
  context: ConsumerContext;
};

export async function activateAgent({
  audience,
  turn,
  context
}: ActivateAgentInput): Promise<string> {
  switch (audience) {
    case "DRIVER":
      return runConsumer(turn, context);
    case "OPERATOR":
      return runOperator(turn, context.authenticatedUserId, context.db);
    default:
      throw new Error("Unsupported agent audience");
  }
}
