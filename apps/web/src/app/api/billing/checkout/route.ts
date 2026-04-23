import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { requireTenantContext } from "@/lib/server-auth";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const schema = z.object({
  plan: z.enum(["starter", "pro", "business"]),
});

const PRICE_MAP: Record<"starter" | "pro" | "business", string> = {
  starter: env.STRIPE_PRICE_STARTER,
  pro: env.STRIPE_PRICE_PRO,
  business: env.STRIPE_PRICE_BUSINESS,
};

export async function POST(req: Request) {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const tenant = await prisma.$admin.tenant.findUnique({ where: { id: authResult.tenantId } });
  if (!tenant) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Tenant not found." } },
      { status: 404 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: tenant.stripeCustomerId ?? undefined,
    line_items: [{ price: PRICE_MAP[parsed.data.plan], quantity: 1 }],
    success_url: `${env.APP_URL}/app/settings/billing?checkout=success`,
    cancel_url: `${env.APP_URL}/app/settings/billing?checkout=cancelled`,
    metadata: { tenantId: tenant.id, plan: parsed.data.plan },
  });

  return NextResponse.json({ ok: true, data: { url: session.url } });
}
