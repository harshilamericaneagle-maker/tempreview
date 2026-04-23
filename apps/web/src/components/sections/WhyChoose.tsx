"use client";

import {
  TrendingUp,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Zap,
  BarChart,
  Heart,
  Target,
  Lightbulb,
} from "lucide-react";

const benefits = [
  {
    title: "Maximize Positive Sentiment",
    description:
      "Our intelligent filtering and request timing ensures you capture customers when they're happiest, driving consistent 5-star ratings.",
    icon: ThumbsUp,
    color: "#6366f1",
  },
  {
    title: "Bulletproof Reputation",
    description:
      "Protect your brand with real-time monitoring and proactive issue detection that identifies negative sentiment before it goes public.",
    icon: ShieldCheck,
    color: "#22c55e",
  },
  {
    title: "Automate Your Workflow",
    description:
      "Stop spending hours manually asking for reviews. Our automated sequences handle everything, so you can focus on your business.",
    icon: Clock,
    color: "#fbbf24",
  },
  {
    title: "Data-Driven Growth",
    description:
      "Convert social proof into cold hard cash. Showcase your reviews where they matter most — right at the point of conversion.",
    icon: TrendingUp,
    color: "#f59e0b",
  },
  {
    title: "Competitive Edge",
    description:
      "Outrank and outshine competitors with a higher review volume and better ratings. Own your local search results instantly.",
    icon: Target,
    color: "#06b6d4",
  },
  {
    title: "Customer Insights",
    description:
      "Understand exactly what your customers love (and what they don't) with automated sentiment analysis and heatmaps.",
    icon: Lightbulb,
    color: "#a855f7",
  },
];

export function WhyChoose() {
  return (
    <section className="py-32 relative">
      <div className="container px-6 lg:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Sticky header */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#86efac",
              }}
            >
              The ReviewManagement Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-8">
              Why the world's best businesses <span className="gradient-text">choose us</span>
            </h2>
            <p className="text-lg mb-10 text-slate-400 leading-relaxed">
              We don't just collect reviews; we build a platform that turns customer satisfaction
              into your most powerful marketing engine.
            </p>
            <div className="space-y-4">
              {[
                { label: "99.9% Platform Uptime", value: "99.9%" },
                { label: "Average Rating Impact", value: "+1.2★" },
                { label: "Time Saved/Week", value: "12hrs" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center py-3 border-b border-white/5"
                >
                  <span className="text-slate-500 text-sm">{stat.label}</span>
                  <span className="text-white font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="premium-card rounded-3xl p-8 group border border-white/5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `${benefit.color}15`,
                    border: `1px solid ${benefit.color}30`,
                  }}
                >
                  <benefit.icon className="h-7 w-7" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                  {benefit.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-slate-400"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
