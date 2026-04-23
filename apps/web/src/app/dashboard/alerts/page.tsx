"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useMemo, useState } from "react";
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

type ReviewItem = {
  id: string;
  rating: number;
  body: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  status: "new" | "read" | "flagged" | "resolved";
  postedAt: string;
  locationName: string;
};

type AlertItem = {
  id: string;
  severity: "critical" | "high" | "medium";
  alertType: string;
  message: string;
  status: "active" | "acknowledged";
  createdAt: string;
  reviewId: string;
};

export default function AlertsPage() {
  const { activeLocation } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeLocation?.id) params.set("locationId", activeLocation.id);
    const res = await fetch(`/api/reviews?${params.toString()}`);
    const json = (await res.json()) as { ok: boolean; data: ReviewItem[] };
    if (json.ok) setReviews(json.data);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, [activeLocation]);

  const alerts = useMemo<AlertItem[]>(() => {
    return reviews
      .filter((r) => r.rating <= 2 || r.sentiment === "negative" || r.status === "flagged")
      .map((r) => {
        const severity: AlertItem["severity"] =
          r.rating <= 1 ? "critical" : r.rating === 2 || r.status === "flagged" ? "high" : "medium";
        const alertType =
          r.status === "flagged"
            ? "Flagged Review"
            : r.rating <= 2
              ? "Low Rating Review"
              : "Negative Sentiment";
        const status: AlertItem["status"] = r.status === "read" ? "acknowledged" : "active";
        return {
          id: `alert-${r.id}`,
          severity,
          alertType,
          message: `${r.locationName}: ${r.body}`,
          status,
          createdAt: r.postedAt,
          reviewId: r.id,
        };
      });
  }, [reviews]);

  const handleAcknowledge = async (reviewId: string) => {
    await fetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });
    await refresh();
  };

  const handleResolve = async (reviewId: string) => {
    await fetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    await refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const acknowledgedAlerts = alerts.filter((a) => a.status === "acknowledged");

  const getSeverityDetails = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          icon: ShieldAlert,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
        };
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        };
      default:
        return {
          icon: Bell,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
        };
    }
  };

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Alerts & Escalation</h1>
          <p className="text-muted-foreground text-sm">
            Live incident feed from negative, low-rated, and flagged reviews.
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">All Clear!</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            You have no active alerts. High-risk reviews will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Active Alerts ({activeAlerts.length})
            </h2>

            {activeAlerts.length === 0 && (
              <p className="text-sm text-muted-foreground">No active alerts right now.</p>
            )}

            <div className="grid gap-3">
              {activeAlerts.map((alert) => {
                const { icon: Icon, color, bg, border } = getSeverityDetails(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border ${border} ${bg} flex gap-4 transition-all hover:brightness-110`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-background/50 border ${border}`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-white capitalize">{alert.alertType}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground/90 mb-3 line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => void handleAcknowledge(alert.reviewId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => void handleResolve(alert.reviewId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {acknowledgedAlerts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Acknowledged (Pending Resolution)
              </h2>
              <div className="grid gap-3 opacity-75">
                {acknowledgedAlerts.map((alert) => {
                  const { icon: Icon, color, bg } = getSeverityDetails(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center gap-4"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white line-clamp-1">
                          {alert.message}
                        </h4>
                      </div>
                      <button
                        onClick={() => void handleResolve(alert.reviewId)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
