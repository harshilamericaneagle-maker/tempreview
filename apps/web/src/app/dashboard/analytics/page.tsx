"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getBusinessAnalytics } from "@/lib/store";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ReturnType<typeof getBusinessAnalytics> | null>(null);

  useEffect(() => {
    if (!user) return;
    const biz = getBusinessByOwner(user.id);
    if (biz) setAnalytics(getBusinessAnalytics(biz.id));
  }, [user]);

  if (!analytics)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );

  const SENTIMENT_DATA = [
    { name: "Positive", value: analytics.sentimentCounts.positive, color: "#22c55e" },
    { name: "Neutral", value: analytics.sentimentCounts.neutral, color: "#f59e0b" },
    { name: "Negative", value: analytics.sentimentCounts.negative, color: "#ef4444" },
  ];

  const RESPONSE_DATA = [
    { name: "Replied", value: analytics.replied, color: "#6366f1" },
    { name: "Pending", value: analytics.pending, color: "#f59e0b" },
  ];

  const tooltipStyle = {
    background: "#0f1629",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "12px",
    color: "#f1f5f9",
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Deep dive into your review performance
            </p>
          </div>
          <a
            href="/api/analytics/export.csv"
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90"
          >
            Export CSV
          </a>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reviews", value: analytics.total, color: "#6366f1" },
            { label: "Average Rating", value: `${analytics.avgRating}★`, color: "#22c55e" },
            { label: "Response Rate", value: `${analytics.responseRate}%`, color: "#06b6d4" },
            {
              label: "Positive Reviews",
              value: `${Math.round((analytics.sentimentCounts.positive / Math.max(analytics.total, 1)) * 100)}%`,
              color: "#f59e0b",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="text-3xl font-bold mb-1" style={{ color }}>
                {value}
              </div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Rating Trend */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Rating Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.weeklyTrend}>
              <defs>
                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
              <YAxis
                domain={[0, 5]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="avgRating"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#ratingGrad)"
                name="Avg Rating"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Review Volume */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Weekly Review Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="reviews" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.ratingDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="rating"
                  type="category"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}★`}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment + Response */}
        <div className="grid grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Analysis</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={SENTIMENT_DATA}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SENTIMENT_DATA.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {SENTIMENT_DATA.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-foreground font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Response Rate</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={RESPONSE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {RESPONSE_DATA.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-primary">{analytics.responseRate}%</span>
              <p className="text-xs text-muted-foreground">of reviews answered</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Top Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {analytics.topKeywords.slice(0, 10).map(({ word, count }, i) => (
                <span
                  key={word}
                  className="px-2.5 py-1 rounded-lg text-xs border"
                  style={{
                    background: `rgba(99,102,241,${0.05 + (10 - i) * 0.015})`,
                    borderColor: `rgba(99,102,241,${0.1 + (10 - i) * 0.03})`,
                    color: `rgba(167,139,250,${0.6 + (10 - i) * 0.04})`,
                  }}
                >
                  {word} <span className="opacity-60">×{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
