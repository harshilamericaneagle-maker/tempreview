import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const querySchema = z.object({
  q: z.string().optional(),
  rating: z.string().optional(),
  status: z.enum(["new", "read", "flagged", "resolved"]).optional(),
  provider: z.enum(["google", "yelp", "facebook", "native"]).optional(),
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
    q: url.searchParams.get("q") ?? undefined,
    rating: url.searchParams.get("rating") ?? undefined,
    status: (url.searchParams.get("status") ?? undefined) as
      | "new"
      | "read"
      | "flagged"
      | "resolved"
      | undefined,
    provider: (url.searchParams.get("provider") ?? undefined) as
      | "google"
      | "yelp"
      | "facebook"
      | "native"
      | undefined,
    locationId: url.searchParams.get("locationId") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const locations = await prisma.$admin.location.findMany({
    where: {
      tenantId: authResult.tenantId,
      ...(parsed.data.locationId ? { id: parsed.data.locationId } : {}),
    },
    select: { id: true, name: true },
  });
  const locationIds = locations.map((l) => l.id);
  const locationMap = new Map(locations.map((l) => [l.id, l.name]));

  const reviews = await prisma.$admin.review.findMany({
    where: {
      locationId: { in: locationIds },
      ...(parsed.data.rating ? { rating: Number(parsed.data.rating) } : {}),
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.provider ? { provider: parsed.data.provider } : {}),
      ...(parsed.data.q
        ? {
            OR: [
              { authorName: { contains: parsed.data.q, mode: "insensitive" } },
              { body: { contains: parsed.data.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      replies: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { postedAt: "desc" },
  });

  return NextResponse.json({
    ok: true,
    data: reviews.map((r) => ({
      id: r.id,
      provider: r.provider,
      rating: r.rating,
      body: r.body,
      topics: r.topics,
      authorName: r.authorName,
      sentiment: r.sentiment,
      status: r.status,
      postedAt: r.postedAt,
      locationId: r.locationId,
      locationName: locationMap.get(r.locationId) ?? "Unknown",
      latestReply: r.replies[0]
        ? {
            id: r.replies[0].id,
            body: r.replies[0].body,
            status: r.replies[0].status,
          }
        : null,
    })),
  });
}
