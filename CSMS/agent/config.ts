import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

type Provider = "anthropic" | "openai";

// Gateway route type: "anthropic" (/anthropic/v1/messages) or "openai"
// (/openai/v1/chat/completions). When unset it is inferred from the base URL.
const baseURL = process.env.AI_GATEWAY_BASE_URL;
const provider = (process.env.AI_GATEWAY_PROVIDER ??
  (baseURL?.includes("/anthropic") ? "anthropic" : "openai")) as Provider;
const model = process.env.AI_GATEWAY_MODEL;
// Optional; left unset because some models reject non-default sampling values.
const temperature = process.env.AI_GATEWAY_TEMPERATURE
  ? Number(process.env.AI_GATEWAY_TEMPERATURE)
  : undefined;
const maxTokens = Number(process.env.AI_GATEWAY_MAX_TOKENS ?? 4096);
// Primary first, then the secondary; AI_GATEWAY_API_KEY is an alias for the primary.
const keys = [
  process.env.AI_GATEWAY_API_KEY_PRIM ?? process.env.AI_GATEWAY_API_KEY,
  process.env.AI_GATEWAY_API_KEY_SEC
].filter((key): key is string => Boolean(key));

const missing = [
  !baseURL && "AI_GATEWAY_BASE_URL",
  !model && "AI_GATEWAY_MODEL",
  !keys.length && "AI_GATEWAY_API_KEY_PRIM"
].filter(Boolean);

if (missing.length) {
  console.warn(`AI agents disabled: missing ${missing.join(", ")}`);
}

const FAILOVER_STATUSES = new Set([401, 403, 429]);

// Sends with the primary key and retries with the next key when the gateway rejects it.
const failoverFetch: typeof fetch = async (input, init) => {
  let response!: Response;
  for (const [index, key] of keys.entries()) {
    const headers = new Headers(init?.headers);
    if (provider === "anthropic") headers.set("x-api-key", key);
    else headers.set("Authorization", `Bearer ${key}`);
    response = await fetch(input, { ...init, headers });
    if (!FAILOVER_STATUSES.has(response.status) || index === keys.length - 1) break;
    console.warn(`[Agent] AI gateway key ${index + 1} rejected (${response.status}); trying next key`);
    await response.body?.cancel();
  }
  return response;
};

type ChatModel = ChatAnthropic | ChatOpenAI;
let chatModel: ChatModel | undefined;

// Built on first use so a missing config only breaks the agents, not startup.
export function getChatModel(): ChatModel {
  if (missing.length) {
    throw new Error(`AI agents are not configured: missing ${missing.join(", ")}`);
  }
  if (provider !== "anthropic" && provider !== "openai") {
    throw new Error(`AI_GATEWAY_PROVIDER must be "anthropic" or "openai", got "${provider}"`);
  }
  chatModel ??=
    provider === "anthropic"
      ? new ChatAnthropic({
          model,
          anthropicApiKey: keys[0],
          // The SDK appends /v1/messages, so the base must not include /v1.
          anthropicApiUrl: baseURL,
          maxTokens,
          ...(temperature !== undefined && { temperature }),
          clientOptions: { fetch: failoverFetch }
        })
      : new ChatOpenAI({
          model,
          apiKey: keys[0],
          // The client appends /chat/completions, so the base includes /v1.
          configuration: { baseURL, fetch: failoverFetch },
          // The gateway exposes /chat/completions only.
          useResponsesApi: false,
          maxTokens,
          ...(temperature !== undefined && { temperature })
        });
  return chatModel;
}
