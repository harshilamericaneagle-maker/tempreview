"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Crosshair, Star } from "lucide-react";

type Competitor = { id: string; name: string };
type BenchmarkData = {
  focus: { id: string; name: string };
  competitors: Competitor[];
  history: Array<Record<string, string | number>>;
};

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

export default function CompetitorsPage() {
  const { activeLocation } = useAuth();
  const [data, setData] = useState<BenchmarkData | null>(null);

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams();
      if (activeLocation?.id) params.set("locationId", activeLocation.id);
      const res = await fetch(`/api/competitors/benchmark?${params.toString()}`);
      const json = (await res.json()) as { ok: boolean; data: BenchmarkData };
      if (json.ok) setData(json.data);
    };
    void load();
  }, [activeLocation]);

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const { competitors, history } = data;
  if (competitors.length === 0) {
    return (
      <div className="p-8 h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Competitor Benchmarking</h1>
            <p className="text-muted-foreground text-sm">
              Compare your location against sibling locations in this tenant.
            </p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Add more locations to unlock benchmark comparisons.
        </div>
      </div>
    );
  }

  const last = history[history.length - 1] ?? {};
  const allScores = [
    { name: "You", score: Number(last.You ?? 0) },
    ...competitors.map((c) => ({ name: c.name, score: Number(last[c.name] ?? 0) })),
  ].sort((a, b) => b.score - a.score);
  const myRank = allScores.findIndex((s) => s.name === "You") + 1;

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Competitor Benchmarking</h1>
          <p className="text-muted-foreground text-sm">
            Compare your reputation against peer locations over the last 6 months.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Your Market Rank</p>
            <p className="text-2xl font-bold text-white">
              #{myRank}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                of {allScores.length}
              </span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Tracked Competitors</p>
            <p className="text-2xl font-bold text-white">{competitors.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Crosshair className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Top Competitor</p>
            <p className="text-lg font-bold text-white truncate max-w-[150px]">
              {allScores[0].name}
            </p>
            <p className="text-xs text-muted-foreground">{allScores[0].score}★ Average</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-bold text-white mb-6">6-Month Rating Trend</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(8, 11, 20, 0.95)",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="You"
                stroke={COLORS[0]}
                strokeWidth={4}
                activeDot={{ r: 8 }}
              />
              {competitors.map((comp, idx) => (
                <Line
                  key={comp.id}
                  type="monotone"
                  dataKey={comp.name}
                  stroke={COLORS[(idx + 1) % COLORS.length]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
