import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import jwt from "jsonwebtoken";
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

  const token = jwt.sign(
    {
      scope: "impersonation",
      actorUserId: admin.session.user.id,
      tenantId: tenant.id,
      tenantName: tenant.name,
    },
    env.NEXTAUTH_SECRET,
    { expiresIn: "15m" },
  );

  const response = NextResponse.json({ ok: true, data: { token } });
  response.cookies.set("rh_impersonation", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.APP_URL.startsWith("https://"),
    path: "/",
    maxAge: 60 * 15,
  });
  return response;
}
