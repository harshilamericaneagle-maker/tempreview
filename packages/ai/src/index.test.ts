import { beforeEach, describe, expect, it, vi } from "vitest";

const createCompletion = vi.fn();
const redisGet = vi.fn(async () => null);
const redisSet = vi.fn(async () => "OK");
const usageCreate = vi.fn(async () => ({}));

vi.mock("@reviewhub/config/env", () => ({
  env: { REDIS_URL: "redis://localhost:6379" },
}));

vi.mock("ioredis", () => {
  return {
    default: class FakeRedis {
      connect = vi.fn(async () => undefined);
      get = redisGet;
      set = redisSet;
    },
  };
});

vi.mock("@reviewhub/db", () => ({
  prisma: {
    $admin: {
      usage: {
        create: usageCreate,
      },
    },
  },
}));

vi.mock("./provider", () => ({
  getAiProvider: () => ({
    models: { analysis: "gpt-4o-mini", replies: "gpt-4o" },
    client: {
      chat: {
        completions: {
          create: createCompletion,
        },
      },
    },
  }),
}));

describe("suggestReply", () => {
  beforeEach(() => {
    createCompletion.mockReset();
    redisGet.mockReset();
    redisSet.mockReset();
    usageCreate.mockReset();
    redisGet.mockResolvedValue(null);
    redisSet.mockResolvedValue("OK");
    usageCreate.mockResolvedValue({});
  });

  it("returns provider suggestion and records usage", async () => {
    createCompletion.mockResolvedValue({
      choices: [{ message: { content: "Thanks Alex, we appreciate your feedback!" } }],
      usage: { total_tokens: 91 },
    });

    const { suggestReply } = await import("./index");
    const response = await suggestReply({
      review: {
        authorName: "Alex",
        rating: 5,
        body: "Great experience.",
      },
      tone: "Professional",
      business: { name: "Demo Bistro", category: "restaurant" },
      tenantId: "tenant-1",
    });

    expect(response.suggestion).toContain("Thanks Alex");
    expect(response.tokens).toBe(91);
    expect(createCompletion).toHaveBeenCalledTimes(1);
    expect(usageCreate).toHaveBeenCalledTimes(1);
  });
});
