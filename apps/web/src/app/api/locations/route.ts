import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/server-auth";

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const locations = await prisma.$admin.location.findMany({
    where: { tenantId: authResult.tenantId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return NextResponse.json({ ok: true, data: locations });
}
