import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
  title: "Review Management Software for Restaurants | ReviewManagement",
  description:
    "Get more 5-star reviews for your restaurant. The best review management tool for diners, cafes, and fine dining.",
};

export default function RestaurantPage() {
  return (
    <IndustryLandingPage
      industry="Restaurant"
      title="Restaurant Review Management Software"
      description="Attract more diners with a 5-star reputation. Automatically collect reviews and improve your online presence on Google, Yelp, and TripAdvisor."
    />
  );
}
