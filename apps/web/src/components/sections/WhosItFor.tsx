"use client";

import {
  Utensils,
  ShoppingBag,
  Wine,
  Stethoscope,
  Scissors,
  Store,
  Briefcase,
  Car,
  Coffee,
  HeartPulse,
} from "lucide-react";

const industries = [
  {
    name: "Restaurants",
    description: "From diners to fine dining. Build a 5-star digital storefront.",
    icon: Utensils,
    href: "/review-management-for-restaurants",
    color: "#f87171",
  },
  {
    name: "Retail Stores",
    description: "Boost foot traffic and online sales with credible social proof.",
    icon: ShoppingBag,
    href: "/review-management-for-retail",
    color: "#60a5fa",
  },
  {
    name: "Liquor Stores",
    description: "Automate review collection and stay ahead of the competition.",
    icon: Wine,
    href: "/review-management-for-liquor-stores",
    color: "#fb923c",
  },
  {
    name: "Medical Clinics",
    description: "Build patient trust with authentic, compliant feedback.",
    icon: Stethoscope,
    href: "/review-management-for-clinics",
    color: "#34d399",
  },
  {
    name: "Salons & Spas",
    description: "Showcase your artistic work and keep your books full.",
    icon: Scissors,
    color: "#f472b6",
  },
  {
    name: "Auto Services",
    description: "Win over customers with deep trust and verified reliability.",
    icon: Car,
    color: "#94a3b8",
  },
  {
    name: "Dentists",
    description: "The most trusted way to grow your local practice.",
    icon: HeartPulse,
    color: "#fbbf24",
  },
  {
    name: "Real Estate",
    description: "Your reputation is your strongest closing tool.",
    icon: Briefcase,
    color: "#818cf8",
  },
  {
    name: "Local Service",
    description: "For every business that depends on local reputation.",
    icon: Store,
    color: "#2dd4bf",
  },
];

export function WhosItFor() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container px-6 lg:px-8 mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#d8b4fe",
            }}
          >
            Tailored Solutions
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Built for <span className="gradient-text">every industry</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(148, 163, 184, 0.8)" }}>
            Whether you're a single-location boutique or a national franchise, our platform adapts
            to your unique workflow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 group cursor-pointer border border-white/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `${industry.color}15`,
                    border: `1px solid ${industry.color}30`,
                    boxShadow: `0 0 20px ${industry.color}10`,
                  }}
                >
                  <industry.icon
                    className="h-7 w-7 transition-colors duration-300"
                    style={{ color: industry.color }}
                  />
                </div>
                <div
                  className="h-2 w-2 rounded-full opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125"
                  style={{ background: industry.color }}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                {industry.name}
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                {industry.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                Learn More
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats callout */}
        <div className="mt-20 glass-card rounded-3xl p-10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h4 className="text-2xl font-bold text-white mb-2">Not seeing your industry?</h4>
              <p className="text-slate-400">
                Our platform is flexible enough to support any business with an online reputation.
              </p>
            </div>
            <button className="btn-primary px-8 py-4 rounded-2xl text-white font-bold whitespace-nowrap">
              Talk to an expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
