import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const createTemplateSchema = z.object({
  channel: z.enum(["sms", "email"]),
  subject: z.string().optional(),
  body: z.string().min(1),
  variables: z.array(z.string()).default([]),
});

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const templates = await prisma.$admin.template.findMany({
    where: { tenantId: authResult.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: templates });
}

export async function POST(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = createTemplateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const created = await prisma.$admin.template.create({
    data: {
      tenantId: authResult.tenantId,
      ...parsed.data,
    },
  });

  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
