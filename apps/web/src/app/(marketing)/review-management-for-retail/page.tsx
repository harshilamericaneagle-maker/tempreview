import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
  title: "Review Management Software for Retail Stores | ReviewManagement",
  description:
    "Boost foot traffic to your retail store with better online reviews. Manage feedback and grow your sales.",
};

export default function RetailPage() {
  return (
    <IndustryLandingPage
      industry="Retail"
      title="Review Management for Retail Stores"
      description="Turn happy shoppers into brand advocates. Collect reviews automatically and showcase your best feedback to attract new customers."
    />
  );
}
