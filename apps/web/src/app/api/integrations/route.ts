import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const createSchema = z.object({
  locationId: z.string().min(1),
  provider: z.enum(["google", "yelp", "facebook"]),
  status: z.enum(["connected", "error", "disconnected"]).default("connected"),
});

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const integrations = await prisma.$admin.integration.findMany({
    where: { location: { tenantId: authResult.tenantId } },
    include: { location: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, data: integrations });
}

export async function POST(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const location = await prisma.$admin.location.findFirst({
    where: { id: parsed.data.locationId, tenantId: authResult.tenantId },
  });
  if (!location) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Location not found." } },
      { status: 404 },
    );
  }

  const created = await prisma.$admin.integration.create({
    data: {
      locationId: parsed.data.locationId,
      provider: parsed.data.provider,
      status: parsed.data.status,
      meta: { source: "dashboard-integrations" },
    },
  });
  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
