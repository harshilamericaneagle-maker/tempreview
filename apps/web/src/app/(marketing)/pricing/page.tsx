import { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Review Management Software Pricing | ReviewManagement",
  description: "Simple and affordable pricing for businesses of all sizes.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small local businesses getting started.",
      price: "$29",
      features: ["1 Location", "100 Review Requests/mo", "Email Support", "Basic Analytics"],
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with multiple locations.",
      price: "$79",
      features: [
        "5 Locations",
        "Unlimited Requests",
        "Priority Email Support",
        "Advanced Analytics",
        "SMS Campaigns",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations needing custom solutions.",
      price: "Custom",
      features: [
        "Unlimited Locations",
        "API Access",
        "Dedicated Success Manager",
        "White-label Options",
        "SLA Support",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Simple, Transparent Pricing"
        description="Choose the plan that fits your business needs. No hidden fees."
      />

      <section className="container py-24 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col h-full transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-xl scale-105 z-10 bg-card"
                  : "border-border/50 bg-background/50 hover:border-primary/50 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium shadow-md">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center mb-8">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-1">/mo</span>
                  )}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/10 rounded-full p-1">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8 pb-8">
                <Link href="/demo" className="w-full">
                  <Button
                    className="w-full h-11 shadow-sm"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
