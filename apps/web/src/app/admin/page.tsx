"use client";
import { useEffect, useState } from "react";
import { getBusinesses, getReviews, getUsers, getPlatformAnalytics } from "@/lib/store";
import { Building2, Star, Users, MessageSquare, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<ReturnType<typeof getPlatformAnalytics> | null>(null);
  const [recentReviews, setRecentReviews] = useState<ReturnType<typeof getReviews>>([]);
  const [businesses, setBusinesses] = useState<ReturnType<typeof getBusinesses>>([]);

  useEffect(() => {
    setStats(getPlatformAnalytics());
    setRecentReviews(getReviews().slice(0, 5));
    setBusinesses(getBusinesses());
  }, []);

  if (!stats)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );

  const statCards = [
    {
      label: "Total Merchants",
      value: stats.totalMerchants,
      icon: Building2,
      color: "from-red-500 to-orange-500",
      href: "/admin/merchants",
    },
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "from-violet-500 to-purple-600",
      href: "/admin/reviews",
    },
    {
      label: "Avg Platform Rating",
      value: `${stats.avgPlatformRating}★`,
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      href: "/admin/reviews",
    },
    {
      label: "Replied Reviews",
      value: stats.replied,
      icon: MessageSquare,
      color: "from-emerald-500 to-green-600",
      href: "/admin/reviews",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">ReviewHub Super Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all block"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Reviews</h2>
            <Link href="/admin/reviews" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentReviews.map((r) => {
              const biz = businesses.find((b) => b.id === r.businessId);
              return (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {r.customerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {r.customerName}
                      </span>
                      <div className="flex gap-0.5 ml-2 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/70">
                      {biz?.name} · {biz?.category}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{r.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Merchants Status */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Merchant Status</h2>
            <Link href="/admin/merchants" className="text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {businesses.map((biz) => {
              const bizReviews = getReviews().filter((r) => r.businessId === biz.id);
              const avg = bizReviews.length
                ? (bizReviews.reduce((s, r) => s + r.rating, 0) / bizReviews.length).toFixed(1)
                : "—";
              return (
                <div
                  key={biz.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30"
                >
                  <span className="text-xl">{biz.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {biz.name}
                      </span>
                      <span
                        className={`text-xs px-1.5 rounded-full ${biz.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                      >
                        {biz.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {biz.category} · {bizReviews.length} reviews · ⭐ {avg}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
