import { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Review Management Software Features | ReviewManagement",
  description:
    "Explore the features of ReviewManagement software. Automated collection, monitoring, analytics, and more.",
};

export default function FeaturesPage() {
  const features = [
    {
      title: "Automated Review Collection",
      description:
        "Automatically request reviews via email or SMS. Set up campaigns that run on autopilot.",
    },
    {
      title: "Real-time Monitoring",
      description:
        "Get notified instantly via email, Slack, or SMS when you receive a new review on any platform.",
    },
    {
      title: "Sentiment Tracking",
      description:
        "Track trends in customer sentiment over time. Identify problem areas before they become issues.",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Visual insights into your reputation performance. Track volume, rating, and sources.",
    },
    {
      title: "Multi-location Support",
      description:
        "Manage reviews for hundreds of locations from one single account with location-specific settings.",
    },
    {
      title: "Cloud-based System",
      description:
        "Access your dashboard from anywhere, anytime. Secure, reliable, and always up to date.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="All-in-One Review Management Platform"
        description="Everything you need to collect, manage, and improve your customer reviews."
      />

      <section className="container py-24 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center space-y-8 bg-muted/30 rounded-3xl p-12 border border-border/50">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses who use ReviewManagement to grow their online reputation.
          </p>
          <Link href="/demo">
            <Button size="lg" className="px-8 shadow-lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
