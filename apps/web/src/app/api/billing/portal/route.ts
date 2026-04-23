import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireTenantContext } from "@/lib/server-auth";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST() {
  const authResult = await requireTenantContext();
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_ERROR", message: authResult.error } },
      { status: authResult.status },
    );
  }

  const tenant = await prisma.$admin.tenant.findUnique({ where: { id: authResult.tenantId } });
  if (!tenant?.stripeCustomerId) {
    return NextResponse.json(
      { ok: false, error: { code: "MISSING_CUSTOMER", message: "No Stripe customer found." } },
      { status: 400 },
    );
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: `${env.APP_URL}/app/settings/billing`,
  });

  return NextResponse.json({ ok: true, data: { url: portal.url } });
}
