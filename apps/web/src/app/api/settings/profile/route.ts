import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const updateSchema = z.object({
  name: z.string().min(1),
  category: z.enum([
    "restaurant",
    "retail",
    "liquor",
    "clinic",
    "salon",
    "hotel",
    "gym",
    "cafe",
    "other",
  ]),
  phone: z.string().optional(),
  address: z.string().min(1),
});

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const tenant = await prisma.$admin.tenant.findUnique({
    where: { id: authResult.tenantId },
    select: { id: true, name: true, category: true },
  });
  const primaryLocation = await prisma.$admin.location.findFirst({
    where: { tenantId: authResult.tenantId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true, address: true, phone: true },
  });

  if (!tenant || !primaryLocation) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Tenant profile not found." } },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      tenant,
      primaryLocation,
    },
  });
}

export async function PATCH(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const primaryLocation = await prisma.$admin.location.findFirst({
    where: { tenantId: authResult.tenantId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!primaryLocation) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Primary location not found." } },
      { status: 404 },
    );
  }

  const [tenant, location] = await Promise.all([
    prisma.$admin.tenant.update({
      where: { id: authResult.tenantId },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
      },
      select: { id: true, name: true, category: true },
    }),
    prisma.$admin.location.update({
      where: { id: primaryLocation.id },
      data: {
        address: parsed.data.address,
        phone: parsed.data.phone ?? null,
      },
      select: { id: true, name: true, slug: true, address: true, phone: true },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    data: { tenant, primaryLocation: location },
  });
}
