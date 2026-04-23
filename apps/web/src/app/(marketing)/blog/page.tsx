import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Review Management Blog | Tips & Strategies",
  description:
    "Read our latest articles on review management, online reputation, and business growth.",
};

export default function BlogPage() {
  const posts = [
    { title: "How to Get More Google Reviews for Your Business", category: "Guides" },
    { title: "Best Review Management Software in 2026", category: "Industry" },
    { title: "Why Online Reviews Are Important for Business", category: "Strategy" },
    { title: "How Reviews Increase Customer Trust", category: "Psychology" },
    { title: "How to Improve Google Rating", category: "Guides" },
    { title: "Review Management for Restaurants Guide", category: "Industry" },
    { title: "How to Handle Negative Reviews", category: "Guides" },
    { title: "How Reviews Impact Business Growth", category: "Strategy" },
    { title: "Best Reputation Management Strategies", category: "Tips" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="ReviewManagement Blog"
        description="Latest tips, strategies, and insights for growing your business reputation."
      />

      <section className="container py-24 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link href="#" key={index} className="block group h-full">
              <Card className="h-full flex flex-col border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* Placeholder for blog image */}
                <div className="h-56 bg-gradient-to-br from-primary/5 to-blue-500/10 group-hover:from-primary/10 group-hover:to-blue-500/20 transition-colors relative">
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-border/50">
                    {post.category}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors text-xl leading-tight line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    Learn the best practices for managing your reviews and reputation effectively in
                    2026.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4 border-t border-border/50 bg-secondary/20">
                  <span className="text-sm text-primary font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
