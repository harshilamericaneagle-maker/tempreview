import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/server-auth";

type InsightPriority = "high" | "medium" | "low";
type InsightTrend = "up" | "down" | "stable";

export async function GET(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const url = new URL(req.url);
  const locationId = url.searchParams.get("locationId") ?? undefined;

  const locations = await prisma.$admin.location.findMany({
    where: {
      tenantId: authResult.tenantId,
      ...(locationId ? { id: locationId } : {}),
    },
    select: { id: true },
  });

  const reviews = await prisma.$admin.review.findMany({
    where: { locationId: { in: locations.map((l) => l.id) } },
    orderBy: { postedAt: "desc" },
    take: 400,
  });

  const topicCount = new Map<string, number>();
  let lowRatings = 0;
  let negatives = 0;
  for (const review of reviews) {
    if (review.rating <= 2) lowRatings += 1;
    if (review.sentiment === "negative") negatives += 1;
    for (const topic of review.topics) {
      topicCount.set(topic, (topicCount.get(topic) ?? 0) + 1);
    }
  }

  const topTopics = [...topicCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const insights = topTopics.map(([topic, count], idx) => {
    const priority: InsightPriority = count >= 10 ? "high" : count >= 5 ? "medium" : "low";
    const trend: InsightTrend = idx % 3 === 0 ? "up" : idx % 3 === 1 ? "down" : "stable";
    return {
      id: `topic-${topic}`,
      icon: priority === "high" ? "🔥" : priority === "medium" ? "⚡" : "✅",
      title: `${topic} feedback pattern`,
      description: `${count} reviews mention ${topic}. Prioritize a focused fix and communicate improvements in responses.`,
      category: "operations",
      priority,
      trend,
      basedOnCount: count,
      actionItems: [
        `Review last 10 mentions of ${topic} with your team.`,
        `Add one concrete SOP/checklist item tied to ${topic}.`,
        "Track impact in weekly review rating trends.",
      ],
    };
  });

  if (lowRatings > 0) {
    insights.unshift({
      id: "low-rating-cluster",
      icon: "🚨",
      title: "Low-rating escalation risk",
      description: `${lowRatings} recent reviews are 1-2★. Create a rapid response workflow to prevent churn.`,
      category: "reputation",
      priority: "high" as InsightPriority,
      trend: "down" as InsightTrend,
      basedOnCount: lowRatings,
      actionItems: [
        "Respond to all 1-2★ reviews within 24 hours.",
        "Escalate repeat complaints to operations lead.",
        "Track weekly reduction in unresolved low-rating reviews.",
      ],
    });
  }

  if (negatives > 0) {
    insights.push({
      id: "negative-sentiment-watch",
      icon: "🧠",
      title: "Negative sentiment watchlist",
      description: `${negatives} reviews were classified as negative sentiment. Audit tone and service recovery quality.`,
      category: "ai-analysis",
      priority: negatives > 8 ? "high" : "medium",
      trend: "stable",
      basedOnCount: negatives,
      actionItems: [
        "Audit reply tone for empathy and clarity.",
        "Use AI-suggested replies as first draft, then personalize.",
        "Review recurring root causes in monthly retro.",
      ],
    });
  }

  return NextResponse.json({ ok: true, data: insights });
}
