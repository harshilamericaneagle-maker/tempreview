"use client";

import { useAuth } from "@/lib/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, TrendingUp, MessageSquare, Clock, X, Send, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
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
  provider: "google" | "yelp" | "facebook" | "native";
  rating: number;
  body: string;
  topics: string[];
  authorName: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  status: "new" | "read" | "flagged" | "resolved";
  postedAt: string;
  locationId: string;
  locationName: string;
  latestReply: { id: string; body: string; status: string } | null;
};

type AnalyticsOverview = {
  totalReviews: number;
  avgRating: number;
  repliedReviews: number;
  responseRate: number;
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "star-filled fill-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function formatWeek(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function DashboardPage() {
  const { activeLocation } = useAuth();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [replyModal, setReplyModal] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedTone, setSelectedTone] = useState<
    "Professional" | "Warm" | "Apologetic" | "Brief"
  >("Professional");
  const [submitting, setSubmitting] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const refresh = useCallback(async () => {
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
    void refresh();
  }, [refresh]);

  const derived = useMemo(() => {
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const topicCount = new Map<string, number>();

    for (const review of reviews) {
      if (review.sentiment) sentimentCounts[review.sentiment] += 1;
      for (const topic of review.topics) {
        topicCount.set(topic, (topicCount.get(topic) ?? 0) + 1);
      }
    }

    const now = new Date();
    const weeks = Array.from({ length: 8 }).map((_, idx) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (7 - idx) * 7);
      return { key: formatWeek(d), reviews: 0, totalRating: 0 };
    });

    for (const review of reviews) {
      const reviewDate = new Date(review.postedAt);
      const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 56) continue;
      const bucket = Math.min(7, Math.floor((56 - diffDays) / 7));
      weeks[bucket].reviews += 1;
      weeks[bucket].totalRating += review.rating;
    }

    return {
      sentimentData: [
        { name: "Positive", value: sentimentCounts.positive, color: "#22c55e" },
        { name: "Neutral", value: sentimentCounts.neutral, color: "#f59e0b" },
        { name: "Negative", value: sentimentCounts.negative, color: "#ef4444" },
      ],
      weeklyTrend: weeks.map((w) => ({
        week: w.key,
        reviews: w.reviews,
        avgRating: w.reviews ? Number((w.totalRating / w.reviews).toFixed(2)) : 0,
      })),
      topKeywords: [...topicCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([word, count]) => ({ word, count })),
    };
  }, [reviews]);

  const recent = reviews.slice(0, 6);
  const newThisWeek = reviews.filter((r) => {
    const d = new Date(r.postedAt);
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const submitReply = async () => {
    if (!replyModal || !replyText.trim()) return;
    setSubmitting(true);
    await fetch(`/api/reviews/${replyModal.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: replyText, tone: selectedTone, isAiSuggested: false }),
    });
    setReplyModal(null);
    setReplyText("");
    setSubmitting(false);
    await refresh();
  };

  const generateSuggestion = async () => {
    if (!replyModal) return;
    setLoadingSuggestion(true);
    const res = await fetch(`/api/reviews/${replyModal.id}/ai-suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone: selectedTone }),
    });
    const json = (await res.json()) as { ok: boolean; data?: { suggestion: string } };
    if (json.ok && json.data?.suggestion) setReplyText(json.data.suggestion);
    setLoadingSuggestion(false);
  };

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Reviews",
      value: overview.totalReviews,
      icon: Star,
      color: "from-violet-500 to-purple-600",
      change: `+${newThisWeek} this week`,
    },
    {
      label: "Average Rating",
      value: `${overview.avgRating}★`,
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      change: "Overall score",
    },
    {
      label: "Response Rate",
      value: `${overview.responseRate}%`,
      icon: MessageSquare,
      color: "from-emerald-500 to-green-600",
      change: `${overview.repliedReviews} replied`,
    },
    {
      label: "Pending Replies",
      value: overview.totalReviews - overview.repliedReviews,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      change: "Needs attention",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {activeLocation?.name ?? "ReviewHub Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {activeLocation ? "Location overview" : "Tenant-wide overview"}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm font-medium text-muted-foreground mb-0.5">{label}</div>
              <div className="text-xs text-muted-foreground/70">{change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="col-span-2 glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Rating Trend (Last 8 Weeks)
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={derived.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f1629",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4 }}
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Mix</h2>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={derived.sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {derived.sentimentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f1629",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {derived.sentimentData.map((s) => (
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Recent Reviews</h2>
            <div className="space-y-3">
              {recent.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {r.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground">{r.authorName}</span>
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{r.body}</p>
                  </div>
                  {!r.latestReply ? (
                    <button
                      onClick={() => {
                        setReplyModal(r);
                        setReplyText("");
                      }}
                      className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                    >
                      Reply
                    </button>
                  ) : (
                    <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Replied
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Top Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {derived.topKeywords.map(({ word, count }) => (
                <span
                  key={word}
                  className="px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20"
                >
                  {word} <span className="text-primary/60 ml-1">x{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Reply to Review</h3>
              <button
                onClick={() => setReplyModal(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{replyModal.authorName}</span>
                <StarDisplay rating={replyModal.rating} />
              </div>
              <p className="text-sm text-muted-foreground">{replyModal.body}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI Reply Assistant
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTone}
                  onChange={(e) =>
                    setSelectedTone(
                      e.target.value as "Professional" | "Warm" | "Apologetic" | "Brief",
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs"
                >
                  <option>Professional</option>
                  <option>Warm</option>
                  <option>Apologetic</option>
                  <option>Brief</option>
                </select>
                <button
                  onClick={() => void generateSuggestion()}
                  className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs"
                >
                  {loadingSuggestion ? "Generating..." : "Generate with AI"}
                </button>
              </div>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Write your reply..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none mb-4"
            />
            <button
              onClick={() => void submitReply()}
              disabled={submitting || !replyText.trim()}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
