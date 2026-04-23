import { env } from "@reviewhub/config/env";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireSuperAdmin } from "@/lib/server-admin";

type ImpersonationToken = {
  scope: "impersonation";
  actorUserId: string;
  tenantId: string;
  tenantName: string;
  exp?: number;
};

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: admin.error } },
      { status: admin.status },
    );
  }

  const token = cookies().get("rh_impersonation")?.value;
  if (!token) return NextResponse.json({ ok: true, data: null });

  try {
    const payload = jwt.verify(token, env.NEXTAUTH_SECRET) as ImpersonationToken;
    return NextResponse.json({
      ok: true,
      data: {
        tenantId: payload.tenantId,
        tenantName: payload.tenantName,
      },
    });
  } catch {
    return NextResponse.json({ ok: true, data: null });
  }
}

export async function DELETE() {
  const admin = await requireSuperAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: admin.error } },
      { status: admin.status },
    );
  }

  const res = NextResponse.json({ ok: true, data: { cleared: true } });
  res.cookies.set("rh_impersonation", "", { path: "/", maxAge: 0 });
  return res;
}
