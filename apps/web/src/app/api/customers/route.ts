import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).default([]),
  consentSms: z.boolean().default(false),
  consentEmail: z.boolean().default(false),
});

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const customers = await prisma.$admin.customer.findMany({
    where: { tenantId: authResult.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: customers });
}

export async function POST(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = createCustomerSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const created = await prisma.$admin.customer.create({
    data: {
      tenantId: authResult.tenantId,
      ...parsed.data,
    },
  });

  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
