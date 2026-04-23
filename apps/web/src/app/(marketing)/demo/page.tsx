import { Metadata } from "next";
import { DemoForm } from "@/components/forms/DemoForm";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "Request a Free Demo | ReviewManagement",
  description:
    " See how ReviewManagement software helps businesses improve ratings and manage reviews efficiently.",
};

export default function DemoPage() {
  const benefits = [
    "Personalized walkthrough of the platform",
    "Expert advice on improving your reputation",
    "Pricing options tailored to your needs",
    "No commitment required",
    "Free reputation audit included",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Request a Free Demo"
        description="See how ReviewManagement software helps businesses improve ratings and manage reviews efficiently."
      />

      <section className="container py-24 px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto items-start">
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to take control of your reviews?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Schedule a call with our team to see how our platform can help you grow your
                business.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">What you'll get:</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/20 border border-border/50"
                  >
                    <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="p-8 border rounded-2xl bg-card shadow-xl border-border/50 sticky top-24">
              <DemoForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
