"use client";

import { Mail, MessageSquare, Star, BarChart3, Zap, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Collect Reviews",
    description:
      "Automatically send personalized review requests via email, SMS, or QR code moments after a purchase or visit.",
    icon: Mail,
    color: "#6366f1",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  {
    step: "02",
    title: "Monitor Everything",
    description:
      "See all your reviews from Google, Yelp, Facebook, and 47 more platforms in one unified, real-time dashboard.",
    icon: MessageSquare,
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    step: "03",
    title: "Respond Instantly",
    description:
      "Use AI-powered response suggestions to reply to every review in seconds. Never miss a customer interaction.",
    icon: Zap,
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  {
    step: "04",
    title: "Grow & Scale",
    description:
      "Watch your ratings climb and conversions soar. Use deep analytics to understand trends and outrank competitors.",
    icon: BarChart3,
    color: "#22c55e",
    glow: "rgba(34, 197, 94, 0.4)",
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 mesh-gradient" />
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-divider absolute bottom-0 left-0 right-0" />

      <div className="container px-6 lg:px-8 mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.3)",
              color: "#67e8f9",
            }}
          >
            How It Works
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-white">From zero to </span>
            <span className="gradient-text">5-star reputation</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(148, 163, 184, 0.8)" }}>
            Four simple steps that put your review management on autopilot and drive real business
            results.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), rgba(6,182,212,0.3), rgba(168,85,247,0.2), rgba(34,197,94,0.2), transparent)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div className="relative w-28 h-28 mb-8">
                  {/* Outer glow ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse, ${step.glow} 0%, transparent 70%)`,
                      transform: "scale(1.4)",
                      filter: "blur(10px)",
                    }}
                  />
                  {/* Main circle */}
                  <div
                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: `rgba(${step.color === "#6366f1" ? "99,102,241" : step.color === "#06b6d4" ? "6,182,212" : step.color === "#a855f7" ? "168,85,247" : "34,197,94"}, 0.1)`,
                      border: `1px solid ${step.color}44`,
                      boxShadow: `0 0 0 0 ${step.glow}`,
                    }}
                  >
                    <step.icon
                      className="h-10 w-10 transition-transform duration-500 group-hover:scale-110"
                      style={{ color: step.color }}
                    />
                  </div>
                  {/* Step number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
                      borderColor: "#080B14",
                      boxShadow: `0 0 12px ${step.glow}`,
                    }}
                  >
                    {index + 1}
                  </div>
                </div>

                <span
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                  style={{ color: step.color }}
                >
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.75)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm mb-4" style={{ color: "rgba(100,116,139,0.8)" }}>
            Ready to get started? Setup takes less than 5 minutes.
          </p>
          <a href="/dashboard">
            <button className="btn-primary text-sm font-semibold px-6 py-3 rounded-xl text-white inline-flex items-center gap-2 group">
              Start Free — No Credit Card
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
