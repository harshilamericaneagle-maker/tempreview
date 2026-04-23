import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const createCampaignSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().min(1),
  trigger: z.enum(["manual", "schedule", "webhook"]),
  schedule: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "completed"]).default("draft"),
});

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const campaigns = await prisma.$admin.campaign.findMany({
    where: { tenantId: authResult.tenantId },
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, data: campaigns });
}

export async function POST(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = createCampaignSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const template = await prisma.$admin.template.findFirst({
    where: { id: parsed.data.templateId, tenantId: authResult.tenantId },
  });
  if (!template) {
    return NextResponse.json(
      { ok: false, error: { code: "TEMPLATE_NOT_FOUND", message: "Template not found." } },
      { status: 404 },
    );
  }

  const created = await prisma.$admin.campaign.create({
    data: {
      tenantId: authResult.tenantId,
      ...parsed.data,
    },
  });

  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}
