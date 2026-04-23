import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";

const STATUS_MAP: Record<string, "queued" | "sent" | "delivered" | "failed"> = {
  queued: "queued",
  sent: "sent",
  delivered: "delivered",
  undelivered: "failed",
  failed: "failed",
};

export async function POST(req: Request) {
  const url = new URL(req.url);
  const requestId = url.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "MISSING_REQUEST_ID", message: "requestId query param is required." },
      },
      { status: 400 },
    );
  }

  const formData = await req.formData();
  const messageStatus = String(formData.get("MessageStatus") ?? "sent").toLowerCase();
  const nextStatus = STATUS_MAP[messageStatus] ?? "sent";

  const data: {
    status: "queued" | "sent" | "delivered" | "failed";
    sentAt?: Date;
  } = { status: nextStatus };
  if (nextStatus === "sent") data.sentAt = new Date();

  await prisma.$admin.reviewRequest.update({
    where: { id: requestId },
    data,
  });

  return NextResponse.json({ ok: true, data: { updated: true } });
}
