"use client";

import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Users, MessageSquare, ChevronRight } from "lucide-react";

function ReviewCard({
  name,
  rating,
  text,
  avatar,
  platform,
}: {
  name: string;
  rating: number;
  text: string;
  avatar: string;
  platform: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 text-left" style={{ minWidth: "220px" }}>
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 star-filled" fill="#FBBF24" />
        ))}
      </div>
      <p className="text-xs text-slate-300 leading-relaxed mb-3">{text}</p>
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
        >
          {avatar}
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{name}</p>
          <p className="text-xs" style={{ color: "rgba(148,163,184,0.8)" }}>
            {platform}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBadge({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3"
      style={{ minWidth: "160px" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs" style={{ color: "rgba(148,163,184,0.8)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        {/* Primary orb */}
        <div
          className="absolute top-[-10%] left-[35%] w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,0.6) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(6,182,212,0.6) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "float 10s ease-in-out infinite 3s",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
                            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
                        `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-sm font-medium cursor-pointer group"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a78bfa",
            }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Now supporting 50+ review platforms
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="gradient-text">Turn Reviews</span>
            <br />
            <span className="text-white">Into Revenue</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ color: "rgba(148, 163, 184, 0.9)" }}
          >
            Collect, manage, and respond to customer reviews from one intelligent platform. Build
            trust, boost rankings, and grow your business — automatically.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link href="/dashboard">
              <button className="btn-primary text-base font-semibold px-8 py-4 rounded-2xl text-white flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/demo">
              <button
                className="text-base font-semibold px-8 py-4 rounded-2xl flex items-center gap-2 group transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(203, 213, 225, 0.9)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                Watch Demo
                <span className="text-xs">▶</span>
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { value: "10,000+", label: "Businesses", icon: Users, color: "#6366f1" },
              { value: "4.9★", label: "Avg Rating", icon: Star, color: "#FBBF24" },
              { value: "2M+", label: "Reviews Managed", icon: MessageSquare, color: "#06b6d4" },
              { value: "340%", label: "Avg Growth", icon: TrendingUp, color: "#22c55e" },
            ].map((stat) => (
              <StatBadge key={stat.label} {...stat} />
            ))}
          </div>

          {/* Dashboard preview with floating review cards */}
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Main dashboard mockup */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "rgba(15, 20, 40, 0.8)",
                border: "1px solid rgba(99,102,241,0.25)",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-5 py-4 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
                </div>
                <div
                  className="mx-auto flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(148,163,184,0.7)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  app.reviewmanagement.com/dashboard
                </div>
              </div>

              {/* Dashboard content */}
              <div className="flex h-[420px] md:h-[520px]">
                {/* Sidebar */}
                <div
                  className="w-56 flex-shrink-0 flex flex-col p-4 gap-1 hidden md:flex"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                    >
                      <Star className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-sm text-white">ReviewHub</span>
                  </div>
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Reviews", active: false },
                    { label: "Analytics", active: false },
                    { label: "Campaigns", active: false },
                    { label: "Settings", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium"
                      style={{
                        background: item.active ? "rgba(99,102,241,0.2)" : "transparent",
                        color: item.active ? "#a78bfa" : "rgba(148,163,184,0.6)",
                        border: item.active
                          ? "1px solid rgba(99,102,241,0.3)"
                          : "1px solid transparent",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: item.active ? "#6366f1" : "rgba(148,163,184,0.3)" }}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-6 overflow-hidden">
                  {/* Header row */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div
                        className="h-5 w-28 rounded-lg mb-1.5"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                      />
                      <div
                        className="h-3 w-18 rounded"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                      }}
                    >
                      + New Campaign
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "Total Reviews", value: "3,842", change: "+18%", color: "#6366f1" },
                      { label: "Avg. Rating", value: "4.8 ★", change: "+0.3", color: "#FBBF24" },
                      { label: "Response Rate", value: "94%", change: "+12%", color: "#22c55e" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl p-4"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <p className="text-xs mb-2" style={{ color: "rgba(148,163,184,0.7)" }}>
                          {card.label}
                        </p>
                        <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: `${card.color}22`, color: card.color }}
                        >
                          {card.change}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs font-semibold text-white">
                        Review Volume — Last 12 Months
                      </p>
                      <div className="flex gap-2">
                        {["1M", "3M", "12M"].map((t, i) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{
                              background: i === 2 ? "rgba(99,102,241,0.3)" : "transparent",
                              color: i === 2 ? "#a78bfa" : "rgba(148,163,184,0.5)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Bar chart */}
                    <div className="flex items-end justify-between h-28 gap-1.5 px-1">
                      {[35, 52, 47, 68, 55, 72, 65, 80, 74, 88, 82, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-lg transition-all duration-500"
                            style={{
                              height: `${h}%`,
                              background:
                                i === 11
                                  ? "linear-gradient(180deg, #818cf8, #6366f1)"
                                  : `linear-gradient(180deg, rgba(99,102,241,${0.3 + i * 0.03}), rgba(99,102,241,0.1))`,
                              boxShadow: i === 11 ? "0 0 15px rgba(99,102,241,0.5)" : "none",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((m) => (
                        <span
                          key={m}
                          className="text-xs flex-1 text-center"
                          style={{ color: "rgba(148,163,184,0.4)", fontSize: "9px" }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating review cards */}
            <div
              className="absolute -left-8 top-[15%] animate-float hidden lg:block"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
            >
              <ReviewCard
                name="Sarah M."
                rating={5}
                text="Game changer for our restaurant! Reviews went from 3.8 to 4.9 in 60 days."
                avatar="S"
                platform="Google Reviews"
              />
            </div>

            <div
              className="absolute -right-8 top-[20%] animate-float-delayed hidden lg:block"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
            >
              <ReviewCard
                name="John K."
                rating={5}
                text="Our Yelp rating jumped to 4.8. Best investment we've made."
                avatar="J"
                platform="Yelp"
              />
            </div>

            <div
              className="absolute -bottom-6 left-[20%] animate-float hidden lg:block"
              style={{ animationDelay: "1s", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
            >
              <ReviewCard
                name="Lisa P."
                rating={5}
                text="300% more reviews in 3 months. Absolutely incredible tool."
                avatar="L"
                platform="Facebook"
              />
            </div>

            {/* Glow underneath dashboard */}
            <div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-16"
              style={{
                background: "radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </div>

          {/* Social proof logos */}
          <div className="mt-20 text-center">
            <p className="text-sm mb-6" style={{ color: "rgba(100, 116, 139, 0.8)" }}>
              Trusted by businesses on all major platforms
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
              {["Google", "Yelp", "Facebook", "TripAdvisor", "OpenTable", "Trustpilot"].map(
                (platform) => (
                  <span
                    key={platform}
                    className="text-sm font-semibold tracking-wide text-slate-400"
                  >
                    {platform}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
