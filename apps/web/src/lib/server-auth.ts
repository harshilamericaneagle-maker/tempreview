import { auth } from "@/auth";

export async function requireTenantContext() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  if (session.user.role === "super_admin" && session.user.tenantId) {
    return { ok: true as const, session, tenantId: session.user.tenantId };
  }

  if (!session.user.tenantId) {
    return { ok: false as const, status: 403, error: "Tenant context missing" };
  }

  return { ok: true as const, session, tenantId: session.user.tenantId };
}
