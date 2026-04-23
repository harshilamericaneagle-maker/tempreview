import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const webhookSchema = z.object({
  type: z.string(),
  data: z
    .object({
      headers: z.record(z.string(), z.string()).optional(),
    })
    .passthrough()
    .optional(),
  requestId: z.string().optional(),
});

const TYPE_TO_STATUS: Record<string, "delivered" | "failed" | "sent"> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.bounced": "failed",
  "email.complained": "failed",
};

export async function POST(req: Request) {
  const parsed = webhookSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const requestId =
    parsed.data.requestId ??
    parsed.data.data?.headers?.["X-ReviewRequest-Id"] ??
    parsed.data.data?.headers?.["x-reviewrequest-id"];

  if (!requestId || typeof requestId !== "string") {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "MISSING_REQUEST_ID", message: "Missing request ID in payload." },
      },
      { status: 400 },
    );
  }

  const status = TYPE_TO_STATUS[parsed.data.type] ?? "sent";
  await prisma.$admin.reviewRequest.update({
    where: { id: requestId },
    data: { status, ...(status === "sent" ? { sentAt: new Date() } : {}) },
  });

  return NextResponse.json({ ok: true, data: { updated: true } });
}
