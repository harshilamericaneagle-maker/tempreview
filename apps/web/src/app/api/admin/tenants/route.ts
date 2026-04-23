import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server-admin";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: admin.error } },
      { status: admin.status },
    );
  }

  const tenants = await prisma.$admin.tenant.findMany({
    include: {
      _count: { select: { locations: true, users: true } },
      usage: true,
      subscription: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const data = tenants.map((t) => ({
    id: t.id,
    name: t.name,
    plan: t.plan,
    status: t.status,
    locations: t._count.locations,
    users: t._count.users,
    mrr: t.subscription
      ? t.subscription.plan === "business"
        ? 299
        : t.subscription.plan === "pro"
          ? 99
          : 29
      : 0,
    aiSpend: t.usage
      .filter((u) => u.kind === "ai_tokens")
      .reduce((sum, u) => sum + Number(u.cost), 0),
  }));

  return NextResponse.json({ ok: true, data });
}
