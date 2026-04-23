import { prisma } from "@reviewhub/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(3),
});

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const location = await prisma.$admin.location.findUnique({
    where: { slug: params.slug },
    include: { tenant: true },
  });

  if (!location) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Location not found." } },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      location: {
        id: location.id,
        name: location.name,
        slug: location.slug,
        address: location.address,
      },
      tenant: {
        id: location.tenant.id,
        name: location.tenant.name,
        category: location.tenant.category,
      },
      links: {
        google: location.googlePlaceId
          ? `https://search.google.com/local/writereview?placeid=${location.googlePlaceId}`
          : null,
        yelp: location.yelpBusinessId
          ? `https://www.yelp.com/writeareview/biz/${location.yelpBusinessId}`
          : null,
      },
    },
  });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const location = await prisma.$admin.location.findUnique({
    where: { slug: params.slug },
    include: { tenant: true },
  });

  if (!location) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Location not found." } },
      { status: 404 },
    );
  }

  const parsed = submitSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message } },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const review = await prisma.$admin.review.create({
    data: {
      locationId: location.id,
      provider: "native",
      providerReviewId: `native-${Date.now()}`,
      rating: payload.rating,
      title: payload.rating <= 3 ? "Private feedback" : "Public feedback",
      body: payload.body,
      authorName: payload.name,
      language: "en",
      postedAt: new Date(),
      fetchedAt: new Date(),
      topics: [],
      status: "new",
    },
  });

  const identityFilters: Array<{ email?: string; phone?: string }> = [];
  if (payload.email) identityFilters.push({ email: payload.email });
  if (payload.phone) identityFilters.push({ phone: payload.phone });

  const existingCustomer =
    identityFilters.length > 0
      ? await prisma.$admin.customer.findFirst({
          where: {
            tenantId: location.tenantId,
            OR: identityFilters,
          },
        })
      : null;

  const customer = existingCustomer
    ? await prisma.$admin.customer.update({
        where: { id: existingCustomer.id },
        data: { name: payload.name, email: payload.email, phone: payload.phone },
      })
    : await prisma.$admin.customer.create({
        data: {
          tenantId: location.tenantId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          tags: [],
          consentSms: false,
          consentEmail: false,
        },
      });

  await prisma.$admin.reviewRequest.create({
    data: {
      locationId: location.id,
      customerId: customer.id,
      channel: "qr",
      status: "submitted",
      submittedReviewId: review.id,
    },
  });

  return NextResponse.json({ ok: true, data: { reviewId: review.id } }, { status: 201 });
}
