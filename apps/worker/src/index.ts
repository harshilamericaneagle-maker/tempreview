import { analyzeReview } from "@reviewhub/ai";
import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import { decryptToken, getProviderClient } from "@reviewhub/integrations";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import pino from "pino";
import { createServer } from "node:http";

const logger = pino({ name: "reviewhub-worker" });
const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

type SyncJobPayload = { integrationId: string };
type AiJobPayload = { reviewId: string; tenantId: string };

const syncQueue = new Queue<SyncJobPayload>("sync", { connection });
const aiQueue = new Queue<AiJobPayload>("ai", { connection });
const notificationsQueue = new Queue("notifications", { connection });
const campaignsQueue = new Queue("campaigns", { connection });
const billingQueue = new Queue("billing", { connection });

const syncWorker = new Worker<SyncJobPayload>(
  "sync",
  async (job) => {
    const integration = await prisma.$admin.integration.findUnique({
      where: { id: job.data.integrationId },
      include: { location: true },
    });
    if (!integration || integration.status !== "connected") return;

    const provider = getProviderClient(integration.provider);
    const accessToken = integration.accessTokenEnc
      ? decryptToken(integration.accessTokenEnc)
      : undefined;

    const reviews = await provider.fetchReviews({
      accessToken,
      locationExternalId: integration.location.googlePlaceId ?? undefined,
      businessExternalId: integration.location.yelpBusinessId ?? undefined,
      pageExternalId: integration.location.fbPageId ?? undefined,
    });

    for (const review of reviews) {
      const upserted = await prisma.$admin.review.upsert({
        where: {
          locationId_provider_providerReviewId: {
            locationId: integration.locationId,
            provider: integration.provider,
            providerReviewId: review.providerReviewId,
          },
        },
        update: {
          rating: review.rating,
          title: review.title ?? null,
          body: review.body,
          authorName: review.authorName,
          authorAvatarUrl: review.authorAvatarUrl ?? null,
          postedAt: review.postedAt,
          fetchedAt: new Date(),
          language: review.language ?? null,
        },
        create: {
          locationId: integration.locationId,
          provider: integration.provider,
          providerReviewId: review.providerReviewId,
          rating: review.rating,
          title: review.title ?? null,
          body: review.body,
          authorName: review.authorName,
          authorAvatarUrl: review.authorAvatarUrl ?? null,
          postedAt: review.postedAt,
          fetchedAt: new Date(),
          language: review.language ?? null,
          topics: [],
          status: "new",
        },
      });

      if (!upserted.sentiment) {
        await aiQueue.add("analyze-review", {
          reviewId: upserted.id,
          tenantId: integration.location.tenantId,
        });
      }
    }
  },
  { connection },
);

const aiWorker = new Worker<AiJobPayload>(
  "ai",
  async (job) => {
    const review = await prisma.$admin.review.findUnique({ where: { id: job.data.reviewId } });
    if (!review) return;

    const result = await analyzeReview({
      body: review.body,
      rating: review.rating,
      language: review.language ?? undefined,
      tenantId: job.data.tenantId,
    });

    await prisma.$admin.review.update({
      where: { id: review.id },
      data: {
        sentiment: result.sentiment,
        sentimentScore: result.sentimentScore,
        language: result.language,
        topics: result.topics,
      },
    });
  },
  { connection },
);

async function scheduleSyncJobs() {
  const connected = await prisma.$admin.integration.findMany({
    where: { status: "connected" },
  });

  for (const integration of connected) {
    const intervalSeconds =
      integration.provider === "google" ? 900 : integration.provider === "yelp" ? 3600 : 1800;
    await syncQueue.upsertJobScheduler(
      `sync-${integration.id}`,
      { every: intervalSeconds * 1000 },
      {
        name: "sync-integration",
        data: { integrationId: integration.id },
      },
    );
  }
}

function startHealthServer() {
  const server = createServer((req, res) => {
    if (req.url === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  server.listen(8080, () => logger.info("Worker health endpoint listening on :8080/healthz"));
  return server;
}

async function shutdown(server: ReturnType<typeof createServer>) {
  logger.info("Shutting down worker...");
  await Promise.all([
    syncWorker.close(),
    aiWorker.close(),
    syncQueue.close(),
    aiQueue.close(),
    notificationsQueue.close(),
    campaignsQueue.close(),
    billingQueue.close(),
    connection.quit(),
    prisma.$disconnect(),
  ]);
  server.close();
  process.exit(0);
}

async function main() {
  await scheduleSyncJobs();
  const server = startHealthServer();
  logger.info("ReviewHub worker started.");

  process.on("SIGINT", () => {
    void shutdown(server);
  });
  process.on("SIGTERM", () => {
    void shutdown(server);
  });
}

main().catch((error) => {
  logger.error({ error }, "Worker startup failed.");
  process.exit(1);
});
