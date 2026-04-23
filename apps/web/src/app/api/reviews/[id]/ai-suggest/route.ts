import { suggestReply } from "@reviewhub/ai";
import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

const bodySchema = z.object({
  tone: z.enum(["Professional", "Warm", "Apologetic", "Brief"]).default("Professional"),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Please sign in." } },
      { status: 401 },
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
    include: {
      location: { include: { tenant: true } },
    },
  });

  if (!review) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Review not found." } },
      { status: 404 },
    );
  }

  if (
    session.user.role !== "super_admin" &&
    (!session.user.tenantId || review.location.tenantId !== session.user.tenantId)
  ) {
    return NextResponse.json(
      { ok: false, error: { code: "FORBIDDEN", message: "Not allowed for this tenant." } },
      { status: 403 },
    );
  }

  const ai = await suggestReply({
    review: {
      authorName: review.authorName,
      rating: review.rating,
      body: review.body,
    },
    tone: parsed.data.tone,
    business: {
      name: review.location.tenant.name,
      category: review.location.tenant.category,
    },
    tenantId: review.location.tenantId,
  });

  return NextResponse.json({
    ok: true,
    data: {
      suggestion: ai.suggestion,
      tokens: ai.tokens,
    },
  });
}
