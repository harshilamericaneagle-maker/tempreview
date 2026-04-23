import { prisma } from "@reviewhub/db";

export type PlanKey = "free" | "starter" | "pro" | "business";

const PLAN_LIMITS: Record<PlanKey, { locations: number; aiCredits: number }> = {
  free: { locations: 1, aiCredits: 50 },
  starter: { locations: 1, aiCredits: 100 },
  pro: { locations: 5, aiCredits: 1000 },
  business: { locations: Number.MAX_SAFE_INTEGER, aiCredits: 5000 },
};

export function getPlanLimits(plan: PlanKey) {
  return PLAN_LIMITS[plan];
}

export async function assertLocationLimit(tenantId: string) {
  const tenant = await prisma.$admin.tenant.findUnique({
    where: { id: tenantId },
    include: { locations: true, subscription: true },
  });
  if (!tenant) throw new Error("Tenant not found.");

  const plan = (tenant.subscription?.plan ?? tenant.plan) as PlanKey;
  const limits = getPlanLimits(plan);
  if (tenant.locations.length >= limits.locations) {
    throw new Error(
      `Plan limit reached. Your ${plan} plan allows ${limits.locations} location(s).`,
    );
  }
}

export async function assertAiCredits(tenantId: string, amount = 1) {
  const sub = await prisma.$admin.subscription.findUnique({ where: { tenantId } });
  if (!sub) return;
  if (sub.aiCreditsRemaining < amount) {
    throw new Error("AI credits exhausted. Please upgrade your plan.");
  }
}
