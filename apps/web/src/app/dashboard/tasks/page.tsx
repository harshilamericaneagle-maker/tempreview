"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

type ReviewTask = {
  id: string;
  rating: number;
  body: string;
  authorName: string;
  status: "new" | "read" | "flagged" | "resolved";
  postedAt: string;
  locationName: string;
};

export default function TasksPage() {
  const { activeLocation } = useAuth();
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeLocation?.id) params.set("locationId", activeLocation.id);
    const res = await fetch(`/api/reviews?${params.toString()}`);
    const json = (await res.json()) as { ok: boolean; data: ReviewTask[] };
    if (json.ok) {
      setTasks(json.data.filter((r) => r.rating <= 3 || r.status === "flagged"));
    }
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, [activeLocation]);

  const handleStatusChange = async (reviewId: string, nextStatus: ReviewTask["status"]) => {
    await fetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
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

  const columns = [
    {
      id: "new",
      title: "Open Issues",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: AlertCircle,
    },
    {
      id: "flagged",
      title: "In Progress",
      color: "border-amber-500/30 bg-amber-500/5",
      icon: Clock,
    },
    {
      id: "resolved",
      title: "Resolved",
      color: "border-emerald-500/30 bg-emerald-500/5",
      icon: CheckCircle2,
    },
  ] as const;

  const getPriority = (rating: number) => {
    if (rating <= 1) return "urgent";
    if (rating === 2) return "high";
    return "medium";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default:
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    }
  };

  return (
    <div className="p-8 h-screen overflow-hidden flex flex-col">
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white mb-1">Action Tracker</h1>
        <p className="text-muted-foreground text-sm">
          Live operational queue generated from low-rated and flagged reviews.
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full pb-8 min-w-[900px]">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => {
              if (col.id === "new") return t.status === "new" || t.status === "read";
              return t.status === col.id;
            });

            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[300px]">
                <div
                  className={`px-4 py-3 rounded-t-xl border-t border-x ${col.color} border-b-transparent flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <col.icon className="w-4 h-4 text-foreground/70" />
                    <h3 className="font-semibold text-sm capitalize">{col.title}</h3>
                  </div>
                  <span className="text-xs bg-background/50 px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex-1 border-x border-b border-border/50 bg-secondary/10 rounded-b-xl p-3 overflow-y-auto space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground/50 text-xs">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const priority = getPriority(task.rating);
                      return (
                        <div
                          key={task.id}
                          className="glass-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(priority)}`}
                            >
                              {priority}
                            </span>
                            <div className="flex gap-1 relative opacity-0 group-hover:opacity-100 transition-opacity">
                              {col.id !== "new" && (
                                <button
                                  onClick={() => void handleStatusChange(task.id, "new")}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                                >
                                  <Circle className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {col.id !== "flagged" && (
                                <button
                                  onClick={() => void handleStatusChange(task.id, "flagged")}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {col.id !== "resolved" && (
                                <button
                                  onClick={() => void handleStatusChange(task.id, "resolved")}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <h4 className="text-sm font-medium text-white mb-1">{task.authorName}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {task.body}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{task.rating}★</span>
                            <span>{task.locationName}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
