import { env } from "@reviewhub/config/env";
import type { ProviderClient, ProviderContext, ProviderReview } from "./types";

export class FacebookProviderClient implements ProviderClient {
  async fetchReviews(context: ProviderContext): Promise<ProviderReview[]> {
    if (!context.pageExternalId || !context.accessToken) {
      throw new Error("Missing Facebook pageExternalId or access token.");
    }

    const fields = "recommendations.limit(50){created_time,review_text,rating,reviewer}";
    const url = `https://graph.facebook.com/v20.0/${context.pageExternalId}?fields=${encodeURIComponent(fields)}&access_token=${context.accessToken}`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const payload = (await response.json()) as {
      recommendations?: {
        data?: Array<{
          id?: string;
          rating?: number;
          review_text?: string;
          created_time?: string;
          reviewer?: { name?: string };
        }>;
      };
    };

    return (payload.recommendations?.data ?? []).map((item, idx) => ({
      providerReviewId: item.id ?? `fb-${idx}-${item.created_time ?? "now"}`,
      rating: item.rating ?? 0,
      body: item.review_text ?? "",
      authorName: item.reviewer?.name ?? "Customer",
      postedAt: item.created_time ? new Date(item.created_time) : new Date(),
    }));
  }

  async healthCheck(): Promise<boolean> {
    return Boolean(env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET);
  }
}
