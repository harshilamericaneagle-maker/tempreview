import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const bodySchema = z.object({
  body: z.string().min(2),
  isAiSuggested: z.boolean().default(false),
  tone: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const review = await prisma.$admin.review.findUnique({
    where: { id: params.id },
    include: { location: true },
  });
  if (!review || review.location.tenantId !== authResult.tenantId) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Review not found." } },
      { status: 404 },
    );
  }

  const reply = await prisma.$admin.reviewReply.create({
    data: {
      reviewId: review.id,
      authorUserId: authResult.session.user.id,
      body: parsed.data.body,
      status: "sent",
      isAiSuggested: parsed.data.isAiSuggested,
      tone: parsed.data.tone,
      sentAt: new Date(),
    },
  });

  await prisma.$admin.review.update({
    where: { id: review.id },
    data: { status: "resolved" },
  });

  return NextResponse.json({ ok: true, data: reply }, { status: 201 });
}
