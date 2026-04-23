"use client";

import { useAuth } from "@/lib/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
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
} from "recharts";

type ReviewItem = {
  id: string;
  rating: number;
  topics: string[];
  sentiment: "positive" | "neutral" | "negative" | null;
  postedAt: string;
};

type AnalyticsOverview = {
  totalReviews: number;
  avgRating: number;
  repliedReviews: number;
  responseRate: number;
};

function formatWeek(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function AnalyticsPage() {
  const { activeLocation } = useAuth();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeLocation?.id) params.set("locationId", activeLocation.id);

    const [overviewRes, reviewsRes] = await Promise.all([
      fetch(`/api/analytics/overview?${params.toString()}`),
      fetch(`/api/reviews?${params.toString()}`),
    ]);
    const overviewJson = (await overviewRes.json()) as { ok: boolean; data: AnalyticsOverview };
    const reviewsJson = (await reviewsRes.json()) as { ok: boolean; data: ReviewItem[] };

    if (overviewJson.ok) setOverview(overviewJson.data);
    if (reviewsJson.ok) setReviews(reviewsJson.data);
  }, [activeLocation?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const derived = useMemo(() => {
    const now = new Date();
    const weeks = Array.from({ length: 8 }).map((_, idx) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - idx) * 7);
      return { week: formatWeek(d), reviews: 0, totalRating: 0 };
    });

    const ratingCounts = new Map<number, number>();
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const topicCount = new Map<string, number>();

    for (const r of reviews) {
      ratingCounts.set(r.rating, (ratingCounts.get(r.rating) ?? 0) + 1);
      if (r.sentiment) sentimentCounts[r.sentiment] += 1;
      for (const topic of r.topics) topicCount.set(topic, (topicCount.get(topic) ?? 0) + 1);

      const reviewDate = new Date(r.postedAt);
      const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 56) continue;
      const bucket = Math.min(7, Math.floor((56 - diffDays) / 7));
      weeks[bucket].reviews += 1;
      weeks[bucket].totalRating += r.rating;
    }

    return {
      weeklyTrend: weeks.map((w) => ({
        week: w.week,
        reviews: w.reviews,
        avgRating: w.reviews ? Number((w.totalRating / w.reviews).toFixed(2)) : 0,
      })),
      ratingDist: [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: ratingCounts.get(rating) ?? 0,
      })),
      sentimentData: [
        { name: "Positive", value: sentimentCounts.positive, color: "#22c55e" },
        { name: "Neutral", value: sentimentCounts.neutral, color: "#f59e0b" },
        { name: "Negative", value: sentimentCounts.negative, color: "#ef4444" },
      ],
      topKeywords: [...topicCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count })),
    };
  }, [reviews]);

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const responseData = [
    { name: "Replied", value: overview.repliedReviews, color: "#6366f1" },
    {
      name: "Pending",
      value: Math.max(0, overview.totalReviews - overview.repliedReviews),
      color: "#f59e0b",
    },
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

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reviews", value: overview.totalReviews, color: "#6366f1" },
            { label: "Average Rating", value: `${overview.avgRating}★`, color: "#22c55e" },
            { label: "Response Rate", value: `${overview.responseRate}%`, color: "#06b6d4" },
            {
              label: "Positive Reviews",
              value: `${Math.round((derived.sentimentData[0].value / Math.max(overview.totalReviews, 1)) * 100)}%`,
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

        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Rating Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={derived.weeklyTrend}>
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
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Weekly Review Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={derived.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="reviews" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={derived.ratingDist} layout="vertical">
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

        <div className="grid grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Analysis</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={derived.sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {derived.sentimentData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Response Rate</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={responseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {responseData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-primary">{overview.responseRate}%</span>
              <p className="text-xs text-muted-foreground">of reviews answered</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Top Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {derived.topKeywords.map(({ word, count }, i) => (
                <span
                  key={word}
                  className="px-2.5 py-1 rounded-lg text-xs border"
                  style={{
                    background: `rgba(99,102,241,${0.05 + (10 - i) * 0.015})`,
                    borderColor: `rgba(99,102,241,${0.1 + (10 - i) * 0.03})`,
                    color: `rgba(167,139,250,${0.6 + (10 - i) * 0.04})`,
                  }}
                >
                  {word} <span className="opacity-60">x{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
