import { prisma } from "@reviewhub/db";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { NextResponse } from "next/server";
import { env } from "@reviewhub/config/env";
import { requireTenantContext } from "@/lib/server-auth";

const redis = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
const campaignsQueue = new Queue("campaigns", { connection: redis });

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const campaign = await prisma.$admin.campaign.findFirst({
    where: { id: params.id, tenantId: authResult.tenantId },
  });
  if (!campaign) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Campaign not found." } },
      { status: 404 },
    );
  }

  await redis.connect().catch(() => undefined);
  await campaignsQueue.add("run-campaign", {
    campaignId: campaign.id,
    tenantId: campaign.tenantId,
  });
  await prisma.$admin.campaign.update({ where: { id: campaign.id }, data: { status: "active" } });

  return NextResponse.json({ ok: true, data: { queued: true } });
}
