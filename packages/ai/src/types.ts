export type AnalyzeReviewInput = {
  body: string;
  rating: number;
  language?: string;
  tenantId?: string;
};

export type AnalyzeReviewOutput = {
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  topics: string[];
  language: string;
  tokens: number;
};

export type SuggestReplyInput = {
  review: {
    authorName?: string;
    rating: number;
    body: string;
  };
  tone: "Professional" | "Warm" | "Apologetic" | "Brief";
  business: {
    name: string;
    category: string;
  };
  tenantId?: string;
};
