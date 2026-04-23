import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const bodySchema = z.object({
  status: z.enum(["connected", "error", "disconnected"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

  const existing = await prisma.$admin.integration.findFirst({
    where: { id: params.id, location: { tenantId: authResult.tenantId } },
  });
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Integration not found." } },
      { status: 404 },
    );
  }

  const updated = await prisma.$admin.integration.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, data: updated });
}
