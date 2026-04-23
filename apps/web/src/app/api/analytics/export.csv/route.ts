import { prisma } from "@reviewhub/db";
import { requireTenantContext } from "@/lib/server-auth";

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return new Response("Unauthorized", { status: authResult.status });
  }

  const locations = await prisma.$admin.location.findMany({
    where: { tenantId: authResult.tenantId },
    select: { id: true, name: true },
  });
  const locationMap = new Map(locations.map((l) => [l.id, l.name]));

  const reviews = await prisma.$admin.review.findMany({
    where: { locationId: { in: locations.map((l) => l.id) } },
    orderBy: { postedAt: "desc" },
  });

  const header = [
    "review_id",
    "location",
    "provider",
    "rating",
    "author",
    "body",
    "sentiment",
    "sentiment_score",
    "posted_at",
  ];
  const lines = reviews.map((r) =>
    [
      r.id,
      locationMap.get(r.locationId) ?? "",
      r.provider,
      r.rating,
      r.authorName.replaceAll('"', '""'),
      r.body.replaceAll('"', '""'),
      r.sentiment ?? "",
      r.sentimentScore ?? "",
      r.postedAt.toISOString(),
    ]
      .map((v) => `"${String(v)}"`)
      .join(","),
  );

  return new Response([header.join(","), ...lines].join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="reviewhub-analytics.csv"',
    },
  });
}
