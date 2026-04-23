import { env } from "@reviewhub/config/env";
import OpenAI from "openai";

export type AiProvider = {
  client: OpenAI;
  models: {
    analysis: string;
    replies: string;
  };
};

export function getAiProvider(): AiProvider {
  if (env.AI_PROVIDER !== "openai") {
    throw new Error(`Unsupported AI provider: ${env.AI_PROVIDER}`);
  }

  return {
    client: new OpenAI({ apiKey: env.OPENAI_API_KEY }),
    models: {
      analysis: "gpt-4o-mini",
      replies: "gpt-4o",
    },
  };
}
