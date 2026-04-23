"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Star } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "super_admin") router.push("/admin");
      else router.push("/app");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #7c3aed, #6366f1, transparent)" }}
      />

      <div className="relative z-10 text-center max-w-2xl px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-14 h-14 rounded-2xl btn-primary flex items-center justify-center">
            <Star className="w-7 h-7 text-white fill-white" />
          </div>
          <span className="text-4xl font-bold gradient-text-primary">ReviewHub</span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          AI-Powered Review
          <br />
          <span className="gradient-text">Management Platform</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
          Automate review collection, analyze feedback with AI, and grow your business reputation —
          all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl btn-primary text-white font-semibold text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            {
              icon: "🤖",
              title: "AI Analysis",
              desc: "Sentiment analysis and smart insights from every review",
            },
            {
              icon: "💬",
              title: "Auto Replies",
              desc: "AI-generated reply suggestions tailored to each review",
            },
            {
              icon: "📊",
              title: "Deep Analytics",
              desc: "Track trends, ratings, and response rates over time",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-card rounded-2xl p-5 text-left">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Demo: <span className="text-amber-400 font-medium">demo@reviewhub.com / demo1234</span>
          {" · "}Admin:{" "}
          <span className="text-red-400 font-medium">admin@reviewhub.com / admin1234</span>
        </div>
      </div>
    </div>
  );
}
