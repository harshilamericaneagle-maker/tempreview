import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const patchSchema = z.object({
  status: z.enum(["new", "read", "flagged", "resolved"]).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const review = await prisma.$admin.review.findUnique({
    where: { id: params.id },
    include: {
      location: { include: { tenant: true } },
      replies: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!review || review.location.tenantId !== authResult.tenantId) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Review not found." } },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data: review });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const existing = await prisma.$admin.review.findUnique({
    where: { id: params.id },
    include: { location: true },
  });
  if (!existing || existing.location.tenantId !== authResult.tenantId) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Review not found." } },
      { status: 404 },
    );
  }

  const updated = await prisma.$admin.review.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ ok: true, data: updated });
}
