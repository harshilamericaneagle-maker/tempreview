import { auth } from "@/auth";
import { env } from "@reviewhub/config/env";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type ImpersonationToken = {
  scope: "impersonation";
  actorUserId: string;
  tenantId: string;
  tenantName: string;
  exp?: number;
};

export async function requireTenantContext() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  if (session.user.role === "super_admin") {
    const token = cookies().get("rh_impersonation")?.value;
    if (token) {
      try {
        const payload = jwt.verify(token, env.NEXTAUTH_SECRET) as ImpersonationToken;
        if (payload.scope === "impersonation" && payload.tenantId) {
          return {
            ok: true as const,
            session,
            tenantId: payload.tenantId,
            impersonation: {
              actorUserId: payload.actorUserId,
              tenantId: payload.tenantId,
              tenantName: payload.tenantName,
            },
          };
        }
      } catch {
        return {
          ok: false as const,
          status: 403,
          error: "Invalid impersonation token.",
        };
      }
    }

    if (session.user.tenantId) {
      return { ok: true as const, session, tenantId: session.user.tenantId };
    }
  }

  if (!session.user.tenantId) {
    return { ok: false as const, status: 403, error: "Tenant context missing" };
  }

  return { ok: true as const, session, tenantId: session.user.tenantId };
}
