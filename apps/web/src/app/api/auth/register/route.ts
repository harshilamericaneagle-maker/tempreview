import { prisma } from "@reviewhub/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  ownerName: z.string().min(2),
  tenantName: z.string().min(2),
  category: z.enum([
    "restaurant",
    "retail",
    "liquor",
    "clinic",
    "salon",
    "hotel",
    "gym",
    "cafe",
    "other",
  ]),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message },
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const email = payload.email.toLowerCase();

    const existing = await prisma.$admin.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: { code: "EMAIL_TAKEN", message: "Email is already registered." } },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const tenant = await prisma.$admin.tenant.create({
      data: {
        name: payload.tenantName,
        category: payload.category,
        plan: "free",
        status: "trial",
        locations: {
          create: {
            name: `${payload.tenantName} - Main`,
            slug: `${toSlug(payload.tenantName)}-main`,
            address: payload.address ?? "Address not provided",
            phone: payload.phone ?? null,
            timezone: "UTC",
          },
        },
      },
    });

    await prisma.$admin.user.create({
      data: {
        email,
        passwordHash,
        name: payload.ownerName,
        phone: payload.phone ?? null,
        role: "owner",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ ok: true, data: { tenantId: tenant.id } }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
