import { env } from "@reviewhub/config/env";
import { prisma } from "@reviewhub/db";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const PLAN_CREDITS: Record<string, { ai: number; sms: number }> = {
  starter: { ai: 100, sms: 100 },
  pro: { ai: 1000, sms: 500 },
  business: { ai: 5000, sms: 2500 },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantId = session.metadata?.tenantId;
    const plan = session.metadata?.plan ?? "starter";
    if (tenantId && session.customer && session.subscription) {
      const periodEnd = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await prisma.$admin.subscription.upsert({
        where: { tenantId },
        update: {
          stripeCustomerId: String(session.customer),
          stripeSubId: String(session.subscription),
          plan,
          status: "active",
          currentPeriodEnd: periodEnd,
          aiCreditsRemaining: PLAN_CREDITS[plan]?.ai ?? 100,
          smsCreditsRemaining: PLAN_CREDITS[plan]?.sms ?? 100,
        },
        create: {
          tenantId,
          stripeCustomerId: String(session.customer),
          stripeSubId: String(session.subscription),
          plan,
          status: "active",
          currentPeriodEnd: periodEnd,
          aiCreditsRemaining: PLAN_CREDITS[plan]?.ai ?? 100,
          smsCreditsRemaining: PLAN_CREDITS[plan]?.sms ?? 100,
        },
      });

      await prisma.$admin.tenant.update({
        where: { id: tenantId },
        data: { stripeCustomerId: String(session.customer), plan: plan as never },
      });
    }
  }

  return new Response("ok", { status: 200 });
}
