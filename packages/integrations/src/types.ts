export type ProviderName = "google" | "yelp" | "facebook";

export type ProviderReview = {
  providerReviewId: string;
  rating: number;
  title?: string;
  body: string;
  authorName: string;
  authorAvatarUrl?: string;
  postedAt: Date;
  language?: string;
};

export type ReplyPayload = {
  providerReviewId: string;
  body: string;
};

export type ProviderContext = {
  accessToken?: string;
  locationExternalId?: string;
  businessExternalId?: string;
  pageExternalId?: string;
};

export interface ProviderClient {
  fetchReviews(context: ProviderContext): Promise<ProviderReview[]>;
  postReply?(context: ProviderContext, payload: ReplyPayload): Promise<void>;
  healthCheck(context: ProviderContext): Promise<boolean>;
}
