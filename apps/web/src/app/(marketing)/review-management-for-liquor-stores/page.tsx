import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
  title: "Review Management Software for Liquor Stores | ReviewManagement",
  description:
    "Improve your liquor store's rating on Google. The #1 review management software for liquor and wine shops.",
};

export default function LiquorStorePage() {
  return (
    <IndustryLandingPage
      industry="Liquor Store"
      title="Review Management for Liquor Stores"
      description="Stand out in local search results. Help customers find your store first by building a strong 5-star reputation online."
    />
  );
}
