import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

interface IndustryLandingPageProps {
  industry: string;
  title: string;
  description: string;
}

export function IndustryLandingPage({ industry, title, description }: IndustryLandingPageProps) {
  const benefits = [
    `Get more reviews from ${industry} customers`,
    `Boost your local SEO ranking for '${industry} near me'`,
    "Manage feedback across Google, Yelp, and more",
    "Increase customer trust and loyalty",
    "Automate review requests after service",
    "Showcase your best reviews on your website",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 leading-tight">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/demo">
                <Button size="lg" className="h-12 px-8 text-lg shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why {industry} Businesses Trust Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Specific tools designed to tackle the unique challenges of the{" "}
                {industry.toLowerCase()} industry.
              </p>
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-background border border-border/50 shadow-sm"
                  >
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-3xl blur-xl transform rotate-3"></div>
              <div className="relative p-10 border rounded-3xl bg-card shadow-xl flex flex-col items-center justify-center text-center space-y-6">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl font-medium italic leading-relaxed text-foreground/80">
                  "Since using ReviewManagement, our {industry.toLowerCase()} has seen a{" "}
                  <span className="text-primary font-bold">200% increase</span> in positive reviews.
                  It's fully automated!"
                </blockquote>
                <div className="flex items-center space-x-4 pt-4 border-t w-full justify-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    JL
                  </div>
                  <div className="text-left">
                    <p className="font-bold">James L.</p>
                    <p className="text-sm text-muted-foreground">{industry} Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Ready to Grow Your {industry} Business?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Start collecting more reviews and improving your reputation today. No credit card
            required.
          </p>
          <Link href="/demo">
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-10 text-lg font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
