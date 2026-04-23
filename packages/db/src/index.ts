import { PrismaClient } from "@prisma/client";

const TENANT_SCOPED_MODELS = new Set([
  "User",
  "Location",
  "Customer",
  "Campaign",
  "Template",
  "AuditLog",
  "Subscription",
  "Usage",
  "ApiKey",
]);

const TENANT_GUARDED_ACTIONS = new Set([
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
]);

function hasTenantWhere(args: unknown): boolean {
  if (!args || typeof args !== "object") return false;
  const where = (args as { where?: unknown }).where;
  if (!where || typeof where !== "object") return false;
  return "tenantId" in (where as Record<string, unknown>);
}

function buildClient(skipTenantGuard: boolean): PrismaClient {
  const prisma = new PrismaClient();

  if (skipTenantGuard) {
    return prisma;
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (
            model &&
            TENANT_SCOPED_MODELS.has(model) &&
            TENANT_GUARDED_ACTIONS.has(operation) &&
            !hasTenantWhere(args)
          ) {
            throw new Error(
              `Tenant scope violation: ${model}.${operation} requires where.tenantId. Use prisma.$admin for super-admin paths.`,
            );
          }

          return query(args);
        },
      },
    },
  }) as PrismaClient;
}

const tenantClient = buildClient(false);
const adminClient = buildClient(true);

export const prisma = Object.assign(tenantClient, {
  $admin: adminClient,
});

export type TenantPrismaClient = typeof prisma;
