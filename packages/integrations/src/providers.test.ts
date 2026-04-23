import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@reviewhub/config/env", () => ({
  env: {
    YELP_API_KEY: "yelp-test-key",
    FACEBOOK_APP_ID: "fb-app",
    FACEBOOK_APP_SECRET: "fb-secret",
    ENCRYPTION_KEY: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    GOOGLE_BUSINESS_CLIENT_ID: "google-client",
    GOOGLE_BUSINESS_CLIENT_SECRET: "google-secret",
  },
}));

const server = setupServer(
  http.get("https://api.yelp.com/v3/businesses/:businessId/reviews", () => {
    return HttpResponse.json({
      reviews: [
        {
          id: "yelp-1",
          rating: 5,
          text: "Amazing staff and super fast service.",
          user: { name: "Ava", image_url: "https://example.com/avatar.jpg" },
          time_created: "2026-03-01T10:00:00Z",
        },
      ],
    });
  }),
  http.get("https://graph.facebook.com/v20.0/:pageId", () => {
    return HttpResponse.json({
      recommendations: {
        data: [
          {
            id: "fb-1",
            rating: 4,
            review_text: "Helpful team and clean place.",
            created_time: "2026-03-05T12:00:00Z",
            reviewer: { name: "Noah" },
          },
        ],
      },
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("provider clients", () => {
  it("maps Yelp reviews into provider review format", async () => {
    const { YelpProviderClient } = await import("./yelp");
    const client = new YelpProviderClient();
    const reviews = await client.fetchReviews({
      businessExternalId: "demo-bistro",
    });

    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      providerReviewId: "yelp-1",
      rating: 5,
      body: "Amazing staff and super fast service.",
      authorName: "Ava",
    });
  });

  it("maps Facebook recommendations into provider review format", async () => {
    const { FacebookProviderClient } = await import("./facebook");
    const client = new FacebookProviderClient();
    const reviews = await client.fetchReviews({
      pageExternalId: "page-123",
      accessToken: "fb-token",
    });

    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      providerReviewId: "fb-1",
      rating: 4,
      body: "Helpful team and clean place.",
      authorName: "Noah",
    });
  });
});
