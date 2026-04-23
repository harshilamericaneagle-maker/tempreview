import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const querySchema = z.object({
  locationId: z.string().optional(),
});

export async function GET(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    locationId: url.searchParams.get("locationId") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const locationWhere = parsed.data.locationId
    ? { tenantId: authResult.tenantId, id: parsed.data.locationId }
    : { tenantId: authResult.tenantId };
  const locations = await prisma.$admin.location.findMany({
    where: locationWhere,
    select: { id: true },
  });
  const locationIds = locations.map((l) => l.id);

  const reviews = await prisma.$admin.review.findMany({
    where: { locationId: { in: locationIds } },
    include: { replies: true },
  });

  const total = reviews.length;
  const avgRating = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const replied = reviews.filter((r) => r.replies.some((rep) => rep.status === "sent")).length;
  const responseRate = total ? Math.round((replied / total) * 100) : 0;

  return NextResponse.json({
    ok: true,
    data: {
      totalReviews: total,
      avgRating: Number(avgRating.toFixed(2)),
      repliedReviews: replied,
      responseRate,
    },
  });
}
