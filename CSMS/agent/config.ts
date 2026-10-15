import { ChatBedrockConverse } from "@langchain/aws";
import "dotenv/config";

const region = process.env.AWS_REGION;
const model = process.env.BEDROCK_MODEL_ID;
// Optional: without it the AWS SDK default credential chain is used.
const profile = process.env.AWS_PROFILE;

const missing = [
  !region && "AWS_REGION",
  !model && "BEDROCK_MODEL_ID"
].filter(Boolean);

if (missing.length) {
  console.warn(`AI agents disabled: missing ${missing.join(", ")}`);
}

let chatModel: ChatBedrockConverse | undefined;

// Built on first use so a missing AWS config only breaks the agents, not startup.
export function getChatModel(): ChatBedrockConverse {
  if (missing.length) {
    throw new Error(`AI agents are not configured: missing ${missing.join(", ")}`);
  }
  chatModel ??= new ChatBedrockConverse({
    region,
    model,
    ...(profile && { profile }),
    temperature: 0
  });
  return chatModel;
}
