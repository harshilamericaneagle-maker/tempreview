import { FacebookProviderClient } from "./facebook";
import { GoogleProviderClient } from "./google";
import { decryptToken, encryptToken } from "./crypto";
import type { ProviderClient, ProviderName } from "./types";
import { YelpProviderClient } from "./yelp";

export function getProviderClient(provider: ProviderName): ProviderClient {
  switch (provider) {
    case "google":
      return new GoogleProviderClient();
    case "yelp":
      return new YelpProviderClient();
    case "facebook":
      return new FacebookProviderClient();
    default:
      throw new Error(`Unsupported provider ${provider satisfies never}`);
  }
}

export { encryptToken, decryptToken };
export type * from "./types";
