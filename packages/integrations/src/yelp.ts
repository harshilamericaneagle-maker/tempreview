import { env } from "@reviewhub/config/env";
import type { ProviderClient, ProviderContext, ProviderReview } from "./types";

export class YelpProviderClient implements ProviderClient {
  async fetchReviews(context: ProviderContext): Promise<ProviderReview[]> {
    if (!context.businessExternalId) {
      throw new Error("Missing Yelp businessExternalId.");
    }

    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${context.businessExternalId}/reviews`,
      {
        headers: { Authorization: `Bearer ${env.YELP_API_KEY}` },
      },
    );

    if (!response.ok) return [];
    const payload = (await response.json()) as {
      reviews?: Array<{
        id: string;
        rating: number;
        text: string;
        user?: { name?: string; image_url?: string };
        time_created?: string;
      }>;
    };

    return (payload.reviews ?? []).map((review) => ({
      providerReviewId: review.id,
      rating: review.rating,
      body: review.text ?? "",
      authorName: review.user?.name ?? "Customer",
      authorAvatarUrl: review.user?.image_url,
      postedAt: review.time_created ? new Date(review.time_created) : new Date(),
    }));
  }

  async healthCheck(): Promise<boolean> {
    return Boolean(env.YELP_API_KEY);
  }
}
