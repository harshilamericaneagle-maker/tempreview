import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/server-auth";

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export async function GET(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const url = new URL(req.url);
  const focusLocationId = url.searchParams.get("locationId") ?? undefined;

  const locations = await prisma.$admin.location.findMany({
    where: { tenantId: authResult.tenantId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });
  if (locations.length === 0) {
    return NextResponse.json({ ok: true, data: { competitors: [], history: [] } });
  }

  const selectedId = focusLocationId ?? locations[0].id;
  const selected = locations.find((l) => l.id === selectedId) ?? locations[0];
  const competitors = locations.filter((l) => l.id !== selected.id);

  const now = new Date();
  const months = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return d;
  });

  const allReviews = await prisma.$admin.review.findMany({
    where: { locationId: { in: locations.map((l) => l.id) } },
    select: { locationId: true, rating: true, postedAt: true },
  });

  const history = months.map((monthStart) => {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const entry: Record<string, number | string> = { name: monthLabel(monthStart) };

    const selectedReviews = allReviews.filter(
      (r) => r.locationId === selected.id && r.postedAt >= monthStart && r.postedAt < monthEnd,
    );
    entry.You =
      selectedReviews.length > 0
        ? Number(
            (
              selectedReviews.reduce((sum, r) => sum + r.rating, 0) / selectedReviews.length
            ).toFixed(2),
          )
        : 0;

    for (const comp of competitors) {
      const compReviews = allReviews.filter(
        (r) => r.locationId === comp.id && r.postedAt >= monthStart && r.postedAt < monthEnd,
      );
      entry[comp.name] =
        compReviews.length > 0
          ? Number(
              (compReviews.reduce((sum, r) => sum + r.rating, 0) / compReviews.length).toFixed(2),
            )
          : 0;
    }

    return entry;
  });

  return NextResponse.json({
    ok: true,
    data: {
      focus: { id: selected.id, name: selected.name },
      competitors: competitors.map((c) => ({ id: c.id, name: c.name })),
      history,
    },
  });
}
