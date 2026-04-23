import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireTenantContext } from "@/lib/server-auth";

export async function GET() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const users = await prisma.$admin.user.findMany({
    where: { tenantId: authResult.tenantId, role: { in: ["owner", "staff"] } },
    select: { id: true, name: true, role: true },
    orderBy: { createdAt: "asc" },
  });

  const sentReplies = await prisma.$admin.reviewReply.findMany({
    where: {
      status: "sent",
      authorUserId: { in: users.map((u) => u.id) },
    },
    include: { review: { select: { rating: true } } },
  });

  const stats = users.map((user) => {
    const repliesByUser = sentReplies.filter((r) => r.authorUserId === user.id);
    const tasksResolved = repliesByUser.length;
    const positiveReviewsHandled = repliesByUser.filter((r) => r.review.rating >= 4).length;
    const points = tasksResolved * 10 + positiveReviewsHandled * 5;

    return {
      user,
      tasksResolved,
      tasksPending: 0,
      positiveReviewsHandled,
      points,
    };
  });

  stats.sort((a, b) => b.points - a.points || b.tasksResolved - a.tasksResolved);
  return NextResponse.json({ ok: true, data: stats });
}
