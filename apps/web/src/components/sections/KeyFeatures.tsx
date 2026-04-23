"use client";

import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Smartphone,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  {
    title: "Unified Inbox",
    description:
      "View all reviews from Google, Facebook, Yelp, Trustpilot, TripAdvisor and 45+ more in a single real-time feed.",
    icon: LayoutDashboard,
    color: "#6366f1",
    badge: "Most Popular",
  },
  {
    title: "AI-Powered Responses",
    description:
      "Generate contextual, brand-aligned responses instantly with GPT-powered AI. Save hours every week.",
    icon: Zap,
    color: "#a855f7",
    badge: "New",
  },
  {
    title: "Automated Campaigns",
    description:
      "Send perfectly timed review requests via email, SMS, or QR code. Fully customizable sequences.",
    icon: Mail,
    color: "#06b6d4",
    badge: null,
  },
  {
    title: "Real-time Alerts",
    description:
      "Get notified the instant a new review drops — on any platform — via push, email, or Slack.",
    icon: Bell,
    color: "#f59e0b",
    badge: null,
  },
  {
    title: "Deep Analytics",
    description:
      "Track sentiment trends, review velocity, competitor benchmarks, and rating trajectories — all visualized beautifully.",
    icon: BarChart3,
    color: "#22c55e",
    badge: null,
  },
  {
    title: "Multi-Location",
    description:
      "Manage reviews for every location from one dashboard. Perfect for franchises and multi-location businesses.",
    icon: Globe,
    color: "#ec4899",
    badge: null,
  },
  {
    title: "Reputation Shield",
    description:
      "Proactively identify at-risk customers before they post a negative review. Protect your brand.",
    icon: Shield,
    color: "#f97316",
    badge: "Premium",
  },
  {
    title: "Mobile App",
    description:
      "Manage your entire reputation from anywhere with our native iOS and Android apps.",
    icon: Smartphone,
    color: "#8b5cf6",
    badge: null,
  },
  {
    title: "API & Integrations",
    description:
      "Connect with your POS, CRM, or booking system. 200+ integrations including Shopify, Square, and HubSpot.",
    icon: MessageSquare,
    color: "#14b8a6",
    badge: null,
  },
];

export function KeyFeatures() {
  return (
    <section className="py-32 relative">
      <div className="container px-6 lg:px-8 mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a78bfa",
            }}
          >
            Platform Features
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything you need to <span className="gradient-text">dominate your market</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(148, 163, 184, 0.8)" }}>
            One platform. Every tool. Zero complexity. Built for businesses that are serious about
            growth.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div key={index} className="premium-card rounded-2xl p-6 cursor-default group">
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}18`,
                    border: `1px solid ${feature.color}33`,
                    boxShadow: `0 0 20px ${feature.color}11`,
                  }}
                >
                  <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                {feature.badge && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${feature.color}18`,
                      color: feature.color,
                      border: `1px solid ${feature.color}33`,
                    }}
                  >
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-violet-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.7)" }}>
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
