import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import crypto from "node:crypto";
import Redis from "ioredis";
import { z } from "zod";
import { ANALYZE_REVIEW_PROMPT_V1, SUGGEST_REPLY_PROMPT_V1 } from "./prompts";
import { getAiProvider } from "./provider";
import type { AnalyzeReviewInput, AnalyzeReviewOutput, SuggestReplyInput } from "./types";

const redis = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });

const analyzeSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentimentScore: z.number().min(-1).max(1),
  topics: z.array(z.string().min(1)).min(1).max(5),
  language: z.string().min(2),
});

function cacheKey(kind: string, parts: string[]) {
  const hash = crypto.createHash("sha256").update(parts.join("|")).digest("hex");
  return `ai:${kind}:${hash}`;
}

async function readCache<T>(key: string): Promise<T | null> {
  await redis.connect().catch(() => undefined);
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

async function writeCache<T>(key: string, value: T) {
  await redis.connect().catch(() => undefined);
  await redis.set(key, JSON.stringify(value), "EX", 60 * 60 * 24 * 30);
}

async function recordUsage(tenantId: string | undefined, tokens: number) {
  if (!tenantId) return;
  await prisma.$admin.usage.create({
    data: {
      tenantId,
      kind: "ai_tokens",
      amount: tokens,
      cost: Number((tokens * 0.000002).toFixed(4)),
      meta: { source: "packages/ai" },
      at: new Date(),
    },
  });
}

export async function analyzeReview(input: AnalyzeReviewInput): Promise<AnalyzeReviewOutput> {
  const key = cacheKey("analyze", [input.body, String(input.rating), input.language ?? "auto"]);
  const cached = await readCache<AnalyzeReviewOutput>(key);
  if (cached) return { ...cached, tokens: 0 };

  const provider = getAiProvider();
  const completion = await provider.client.chat.completions.create({
    model: provider.models.analysis,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYZE_REVIEW_PROMPT_V1 },
      {
        role: "user",
        content: JSON.stringify({
          body: input.body,
          rating: input.rating,
          language: input.language ?? null,
        }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = analyzeSchema.parse(JSON.parse(content));
  const tokens = completion.usage?.total_tokens ?? 0;

  const output: AnalyzeReviewOutput = { ...parsed, tokens };
  await writeCache(key, output);
  await recordUsage(input.tenantId, tokens);
  return output;
}

export async function suggestReply(
  input: SuggestReplyInput,
): Promise<{ suggestion: string; tokens: number }> {
  const key = cacheKey("reply", [
    input.review.body,
    String(input.review.rating),
    input.tone,
    input.business.name,
    input.business.category,
  ]);

  const cached = await readCache<{ suggestion: string; tokens: number }>(key);
  if (cached) return { ...cached, tokens: 0 };

  const provider = getAiProvider();
  const completion = await provider.client.chat.completions.create({
    model: provider.models.replies,
    temperature: 0.4,
    messages: [
      { role: "system", content: SUGGEST_REPLY_PROMPT_V1 },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const suggestion = completion.choices[0]?.message?.content?.trim() ?? "Thanks for your feedback.";
  const tokens = completion.usage?.total_tokens ?? 0;

  const output = { suggestion, tokens };
  await writeCache(key, output);
  await recordUsage(input.tenantId, tokens);
  return output;
}

export type { AnalyzeReviewInput, AnalyzeReviewOutput, SuggestReplyInput };
export { ANALYZE_REVIEW_PROMPT_V1, SUGGEST_REPLY_PROMPT_V1 };
export {};
