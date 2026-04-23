import bcrypt from "bcryptjs";
import {
  CampaignStatus,
  CampaignTrigger,
  IntegrationStatus,
  IntegrationProvider,
  PrismaClient,
  RequestChannel,
  RequestStatus,
  ReviewProvider,
  ReviewSentiment,
  ReviewStatus,
  TemplateChannel,
  TenantCategory,
  TenantPlan,
  TenantStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

function sentimentFromRating(rating: number): ReviewSentiment {
  if (rating >= 4) return ReviewSentiment.positive;
  if (rating === 3) return ReviewSentiment.neutral;
  return ReviewSentiment.negative;
}

async function main() {
  await prisma.reviewReply.deleteMany();
  await prisma.reviewRequest.deleteMany();
  await prisma.review.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.template.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.usage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const adminHash = await bcrypt.hash("admin1234", 12);
  const demoHash = await bcrypt.hash("demo1234", 12);

  const demoTenant = await prisma.tenant.create({
    data: {
      name: "Demo Bistro",
      category: TenantCategory.restaurant,
      plan: TenantPlan.pro,
      status: TenantStatus.active,
      stripeCustomerId: "cus_demo_bistro",
    },
  });

  const [adminUser, ownerUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@reviewhub.com",
        passwordHash: adminHash,
        name: "ReviewHub Admin",
        role: UserRole.super_admin,
      },
    }),
    prisma.user.create({
      data: {
        email: "demo@reviewhub.com",
        passwordHash: demoHash,
        name: "Demo Bistro Owner",
        role: UserRole.owner,
        tenantId: demoTenant.id,
      },
    }),
  ]);

  const [downtown, airport] = await Promise.all([
    prisma.location.create({
      data: {
        tenantId: demoTenant.id,
        name: "Demo Bistro - Downtown",
        slug: "demo-bistro-downtown",
        address: "123 Market St, San Francisco, CA",
        timezone: "America/Los_Angeles",
      },
    }),
    prisma.location.create({
      data: {
        tenantId: demoTenant.id,
        name: "Demo Bistro - Airport",
        slug: "demo-bistro-airport",
        address: "1 Airport Rd, San Francisco, CA",
        timezone: "America/Los_Angeles",
      },
    }),
  ]);

  await prisma.integration.createMany({
    data: [
      {
        locationId: downtown.id,
        provider: IntegrationProvider.google,
        status: IntegrationStatus.connected,
        meta: {},
      },
      {
        locationId: downtown.id,
        provider: IntegrationProvider.yelp,
        status: IntegrationStatus.connected,
        meta: {},
      },
      {
        locationId: airport.id,
        provider: IntegrationProvider.facebook,
        status: IntegrationStatus.connected,
        meta: {},
      },
    ],
  });

  const authors = ["Ava", "Liam", "Noah", "Mia", "Olivia", "Ethan", "Sofia", "Lucas"];
  const reviewBodies = [
    "Great food and fast service.",
    "Friendly staff and cozy atmosphere.",
    "Average experience, but the coffee was good.",
    "Wait time was too long during lunch.",
    "Excellent quality and very clean location.",
    "Music was too loud, but the team was kind.",
    "Loved the dessert menu and attentive service.",
    "Not bad overall, but pricing feels high.",
  ];
  const providers: ReviewProvider[] = [
    ReviewProvider.google,
    ReviewProvider.yelp,
    ReviewProvider.facebook,
    ReviewProvider.native,
  ];

  const reviews = Array.from({ length: 40 }).map((_, idx) => {
    const rating = (idx % 5) + 1;
    const postedAt = new Date();
    postedAt.setDate(postedAt.getDate() - (idx * 2 + 1));
    return {
      locationId: idx % 2 === 0 ? downtown.id : airport.id,
      provider: providers[idx % providers.length],
      providerReviewId: `seed-review-${idx + 1}`,
      rating,
      body: reviewBodies[idx % reviewBodies.length],
      authorName: authors[idx % authors.length],
      postedAt,
      fetchedAt: new Date(),
      sentiment: sentimentFromRating(rating),
      sentimentScore: rating >= 4 ? 0.82 : rating === 3 ? 0.11 : -0.73,
      topics: rating >= 4 ? ["service", "quality"] : ["wait_time", "pricing"],
      status: ReviewStatus.new,
    };
  });

  await prisma.review.createMany({ data: reviews });

  const customers = await Promise.all(
    Array.from({ length: 25 }).map((_, idx) =>
      prisma.customer.create({
        data: {
          tenantId: demoTenant.id,
          name: `Customer ${idx + 1}`,
          email: `customer${idx + 1}@example.com`,
          phone: `+1555000${String(idx + 1).padStart(4, "0")}`,
          tags: idx % 2 === 0 ? ["vip"] : ["new"],
          consentSms: idx % 3 !== 0,
          consentEmail: true,
        },
      }),
    ),
  );

  const [smsTemplate, emailTemplate, followupTemplate] = await Promise.all([
    prisma.template.create({
      data: {
        tenantId: demoTenant.id,
        channel: TemplateChannel.sms,
        body: "Hi {{name}}, we'd love your feedback on your visit to {{location}}.",
        variables: ["name", "location"],
      },
    }),
    prisma.template.create({
      data: {
        tenantId: demoTenant.id,
        channel: TemplateChannel.email,
        subject: "How was your visit to Demo Bistro?",
        body: "Hi {{name}}, share your experience at {{location}}.",
        variables: ["name", "location"],
      },
    }),
    prisma.template.create({
      data: {
        tenantId: demoTenant.id,
        channel: TemplateChannel.email,
        subject: "Quick follow-up from Demo Bistro",
        body: "Thanks for stopping by! Tell us what we can improve.",
        variables: ["name"],
      },
    }),
  ]);

  await prisma.campaign.createMany({
    data: [
      {
        tenantId: demoTenant.id,
        name: "Weekly Feedback Push",
        templateId: emailTemplate.id,
        trigger: CampaignTrigger.schedule,
        schedule: "0 9 * * 1",
        status: CampaignStatus.active,
      },
      {
        tenantId: demoTenant.id,
        name: "Post-Visit Follow-up",
        templateId: followupTemplate.id,
        trigger: CampaignTrigger.manual,
        status: CampaignStatus.completed,
      },
    ],
  });

  await prisma.reviewRequest.create({
    data: {
      locationId: downtown.id,
      customerId: customers[0].id,
      channel: RequestChannel.email,
      status: RequestStatus.sent,
      sentAt: new Date(),
    },
  });

  await prisma.subscription.create({
    data: {
      tenantId: demoTenant.id,
      stripeCustomerId: "cus_demo_bistro",
      stripeSubId: "sub_demo_bistro",
      plan: "pro",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      aiCreditsRemaining: 980,
      smsCreditsRemaining: 450,
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: demoTenant.id,
      actorUserId: ownerUser.id,
      action: "seed.initialized",
      targetType: "tenant",
      targetId: demoTenant.id,
      metadata: { seededBy: adminUser.email },
      at: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
