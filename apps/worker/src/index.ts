import { analyzeReview } from "@reviewhub/ai";
import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import { decryptToken, getProviderClient } from "@reviewhub/integrations";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import pino from "pino";
import { Resend } from "resend";
import { createServer } from "node:http";
import Twilio from "twilio";

const logger = pino({ name: "reviewhub-worker" });
const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

type SyncJobPayload = { integrationId: string };
type AiJobPayload = { reviewId: string; tenantId: string };
type CampaignJobPayload = { campaignId: string; tenantId: string };
type NotificationJobPayload = { requestId: string; channel: "sms" | "email" };

const syncQueue = new Queue<SyncJobPayload>("sync", { connection });
const aiQueue = new Queue<AiJobPayload>("ai", { connection });
const notificationsQueue = new Queue<NotificationJobPayload>("notifications", { connection });
const campaignsQueue = new Queue<CampaignJobPayload>("campaigns", { connection });
const billingQueue = new Queue("billing", { connection });
const resend = new Resend(env.RESEND_API_KEY);
const twilio = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

function renderTemplate(template: string, variables: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? "");
}

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

const campaignWorker = new Worker<CampaignJobPayload>(
  "campaigns",
  async (job) => {
    const campaign = await prisma.$admin.campaign.findFirst({
      where: { id: job.data.campaignId, tenantId: job.data.tenantId },
      include: { template: true, tenant: true },
    });
    if (!campaign) return;

    const locations = await prisma.$admin.location.findMany({
      where: { tenantId: campaign.tenantId },
    });
    if (locations.length === 0) return;
    const location = locations[0];

    const customers = await prisma.$admin.customer.findMany({
      where: { tenantId: campaign.tenantId },
    });
    for (const customer of customers) {
      const allowed =
        campaign.template.channel === "sms"
          ? customer.consentSms && !!customer.phone
          : customer.consentEmail && !!customer.email;
      if (!allowed) continue;

      const request = await prisma.$admin.reviewRequest.create({
        data: {
          locationId: location.id,
          customerId: customer.id,
          channel: campaign.template.channel,
          status: "queued",
        },
      });

      const reviewUrl = `${env.APP_URL}/r/${location.slug}`;
      const content = renderTemplate(campaign.template.body, {
        name: customer.name,
        location: location.name,
        review_link: reviewUrl,
      });

      try {
        if (campaign.template.channel === "sms" && customer.phone) {
          await twilio.messages.create({
            from: env.TWILIO_FROM_NUMBER,
            to: customer.phone,
            body: `${content}\n${reviewUrl}`,
            statusCallback: `${env.APP_URL}/api/webhooks/twilio?requestId=${request.id}`,
          });
        } else if (campaign.template.channel === "email" && customer.email) {
          await resend.emails.send({
            from: env.RESEND_FROM,
            to: customer.email,
            subject: campaign.template.subject ?? `How was your experience at ${location.name}?`,
            html: `<p>${content}</p><p><a href="${reviewUrl}">Leave feedback</a></p>`,
            headers: { "X-ReviewRequest-Id": request.id },
          });
        }

        await prisma.$admin.reviewRequest.update({
          where: { id: request.id },
          data: { status: "sent", sentAt: new Date() },
        });

        await notificationsQueue.add("request-sent", {
          requestId: request.id,
          channel: campaign.template.channel,
        });
      } catch (error) {
        logger.error({ error, requestId: request.id }, "Failed to send campaign message.");
        await prisma.$admin.reviewRequest.update({
          where: { id: request.id },
          data: { status: "failed" },
        });
      }
    }

    await prisma.$admin.campaign.update({
      where: { id: campaign.id },
      data: { status: "completed" },
    });
  },
  { connection },
);

const notificationsWorker = new Worker<NotificationJobPayload>(
  "notifications",
  async (job) => {
    logger.info(
      { requestId: job.data.requestId, channel: job.data.channel },
      "Notification lifecycle event recorded.",
    );
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
    campaignWorker.close(),
    notificationsWorker.close(),
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
