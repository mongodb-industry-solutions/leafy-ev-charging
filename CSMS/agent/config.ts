import { ChatBedrockConverse } from "@langchain/aws";
import "dotenv/config";

const region = process.env.AWS_REGION;
const model = process.env.BEDROCK_MODEL_ID;
const profile = process.env.AWS_PROFILE;

if (!region || !model || !profile) {
  throw new Error("AWS_REGION, BEDROCK_MODEL_ID, and AWS_PROFILE are required");
}

export const chatModel = new ChatBedrockConverse({
  region,
  model,
  profile,
  temperature: 0
});