"use client";
import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Zap, BarChart3, Clock, CheckCircle2 } from "lucide-react";

export default function WhyUsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
          <Star className="w-4 h-4" /> The New Standard in Review Management
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Why Choose <span className="gradient-text-primary">ReviewHub?</span>
        </h1>

        {/* The Value Proposition */}
        <div className="max-w-3xl mx-auto bg-secondary/30 border border-primary/30 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic relative z-10">
            "Right now, motel owners get reviews in different places, miss negative feedback, reply
            late, and do not always know what problem is hurting their ratings most. This system
            puts everything in one place and helps turn reviews into more bookings and better
            operations."
          </p>
          <div className="absolute -bottom-6 -right-6 text-primary/10">
            <Star className="w-32 h-32" />
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Turn Reviews Into Action</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We do more than just collect stars. We provide the operational tools to fix the root
            cause of every complaint.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Centralized Inbox",
              desc: "Stop hunting across Google, Expedia, and TripAdvisor. We pull every review into a single, actionable dashboard.",
            },
            {
              icon: Zap,
              title: "Automated Urgency",
              desc: "Don't let a 1-star review sit unnoticed. Get instant alerts for critical complaints and trigger immediate recovery.",
            },
            {
              icon: Clock,
              title: "AI Response Center",
              desc: "Respond to guests in seconds, not days. Our AI drafts professional, brand-aligned responses automatically.",
            },
            {
              icon: CheckCircle2,
              title: "Action Tracker",
              desc: "Link a bad review directly to a maintenance or housekeeping task. Fix the AC before the next guest arrives.",
            },
            {
              icon: BarChart3,
              title: "Complaint Analytics",
              desc: "Identify whether cleanliness or internet speed is costing you the most stars. Actionable insights, not just numbers.",
            },
            {
              icon: Star,
              title: "More Real Reviews",
              desc: "Automate SMS and Email requests right after checkout. Drown out the bad reviews with genuine 5-star experiences.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-12 rounded-3xl border border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Stop Reacting. Start Improving.</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the motel operators who are turning their online reputation into their biggest
              operational advantage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl btn-primary text-white font-bold text-lg inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 rounded-xl bg-secondary text-white font-bold text-lg inline-flex items-center justify-center border border-border hover:bg-secondary/80 transition-colors"
              >
                Try Live Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
