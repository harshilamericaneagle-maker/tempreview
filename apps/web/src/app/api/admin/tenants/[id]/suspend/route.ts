import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/server-admin";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSuperAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: admin.error } },
      { status: admin.status },
    );
  }

  const tenant = await prisma.$admin.tenant.findUnique({ where: { id: params.id } });
  if (!tenant) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Tenant not found." } },
      { status: 404 },
    );
  }

  const updated = await prisma.$admin.tenant.update({
    where: { id: params.id },
    data: { status: tenant.status === "suspended" ? "active" : "suspended" },
  });

  return NextResponse.json({ ok: true, data: updated });
}
