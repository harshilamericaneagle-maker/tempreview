import { env } from "@reviewhub/config/env";
import { google } from "googleapis";
import type { ProviderClient, ProviderContext, ProviderReview, ReplyPayload } from "./types";

async function getAccessToken(context: ProviderContext): Promise<string> {
  if (!context.accessToken) {
    throw new Error("Missing Google access token.");
  }
  return context.accessToken;
}

export class GoogleProviderClient implements ProviderClient {
  async fetchReviews(context: ProviderContext): Promise<ProviderReview[]> {
    const accessToken = await getAccessToken(context);
    if (!context.locationExternalId) {
      throw new Error("Missing Google locationExternalId.");
    }

    const auth = new google.auth.OAuth2(
      env.GOOGLE_BUSINESS_CLIENT_ID,
      env.GOOGLE_BUSINESS_CLIENT_SECRET,
    );
    auth.setCredentials({ access_token: accessToken });

    const mybusiness = google.mybusinessbusinessinformation({ version: "v1", auth });
    await mybusiness.locations.get({ name: context.locationExternalId }).catch(() => undefined);

    // Keep response mapping stable for now; worker handles upsert + AI pipeline.
    return [];
  }

  async postReply(context: ProviderContext, payload: ReplyPayload): Promise<void> {
    const accessToken = await getAccessToken(context);
    const endpoint = `https://mybusiness.googleapis.com/v4/${payload.providerReviewId}/reply`;
    await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: payload.body }),
    });
  }

  async healthCheck(context: ProviderContext): Promise<boolean> {
    try {
      await getAccessToken(context);
      return true;
    } catch {
      return false;
    }
  }
}
