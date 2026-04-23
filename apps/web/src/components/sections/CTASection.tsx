"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[#080B14]" />

      {/* Mesh gradient container */}
      <div className="container px-6 lg:px-8 mx-auto relative">
        <div
          className="rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.1) 50%, rgba(6,182,212,0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Animated light orbs inside CTA */}
          <div
            className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-30 blur-[100px] animate-pulse"
            style={{ background: "#6366f1" }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] animate-pulse"
            style={{ background: "#06b6d4" }}
          />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Stop guessing. <br />
              <span className="gradient-text">Start growing.</span>
            </h2>
            <p
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ color: "rgba(148, 163, 184, 0.9)" }}
            >
              Join 10,000+ businesses using ReviewManagement to scale their reputation on autopilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="btn-primary text-lg font-bold px-10 py-5 rounded-2xl text-white w-full sm:w-auto flex items-center justify-center gap-3 group">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/demo" className="w-full sm:w-auto">
                <button
                  className="text-lg font-bold px-10 py-5 rounded-2xl w-full sm:w-auto transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(99,102,241,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  Book a Demo
                </button>
              </Link>
            </div>

            {/* Feature checklist */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                "No credit card required",
                "Cancel anytime",
                "Setup in < 5 mins",
                "All features included",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
