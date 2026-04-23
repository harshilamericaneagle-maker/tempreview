import { Metadata } from "next";
import { IndustryLandingPage } from "@/components/templates/IndustryLandingPage";

export const metadata: Metadata = {
  title: "Review Management Software for Clinics | ReviewManagement",
  description:
    "Build patient trust with better reviews. HIPAA-compliant review management for clinics and healthcare providers.",
};

export default function ClinicPage() {
  return (
    <IndustryLandingPage
      industry="Medical"
      title="Review Management for Clinics"
      description="Healthcare reputation management made simple. Collect patient feedback privately or request public reviews to grow your practice."
    />
  );
}
