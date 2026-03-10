"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getReviewsByBusiness } from "@/lib/store";
import { generateInsights, AIInsight } from "@/lib/ai-analysis";
import { TrendingUp, TrendingDown, Minus, CheckCircle, Circle } from "lucide-react";

const PRIORITY_STYLES = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export default function AIInsightsPage() {
    const { user, activeLocation } = useAuth();
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [actioned, setActioned] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        const reviews = getReviewsByBusiness(biz.id).filter(r => !activeLocation || r.locationId === activeLocation.id);
        setInsights(generateInsights(reviews));
    }, [user, activeLocation]);

    const toggleActioned = (id: string) => {
        setActioned(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const high = insights.filter(i => i.priority === "high");
    const medium = insights.filter(i => i.priority === "medium");
    const low = insights.filter(i => i.priority === "low");

    return (
        <div className="h-screen overflow-y-auto">
            <div className="p-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">✨</span>
                        <h1 className="text-2xl font-bold text-white">AI Insights</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">Actionable suggestions generated from your customer feedback</p>
                </div>

                {insights.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <p className="text-4xl mb-3">🤖</p>
                        <p className="text-muted-foreground">Not enough review data yet to generate insights. Keep collecting reviews!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {[{ label: "🔴 High Priority", items: high }, { label: "🟡 Medium Priority", items: medium }, { label: "🟢 Low Priority", items: low }]
                            .filter(g => g.items.length > 0)
                            .map(group => (
                                <div key={group.label}>
                                    <h2 className="text-sm font-semibold text-muted-foreground mb-3">{group.label}</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {group.items.map(insight => {
                                            const done = actioned.has(insight.id);
                                            return (
                                                <div key={insight.id} className={`glass-card rounded-2xl p-6 transition-all ${done ? "opacity-50" : ""}`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="text-3xl flex-shrink-0">{insight.icon}</div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h3 className="font-bold text-white text-base">{insight.title}</h3>
                                                                        {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                                                                        {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                                                                        {insight.trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground" />}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[insight.priority]}`}>
                                                                            {insight.priority} priority
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">{insight.category}</span>
                                                                        <span className="text-xs text-muted-foreground">· Based on {insight.basedOnCount} review{insight.basedOnCount !== 1 ? "s" : ""}</span>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => toggleActioned(insight.id)}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-colors flex-shrink-0 ${done
                                                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                        : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                                                                        }`}>
                                                                    {done ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                                                    {done ? "Actioned" : "Mark as Actioned"}
                                                                </button>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>

                                                            <div>
                                                                <p className="text-xs font-semibold text-foreground mb-2">Action Items:</p>
                                                                <ul className="space-y-1.5">
                                                                    {insight.actionItems.map((item, i) => (
                                                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                                                                                {i + 1}
                                                                            </div>
                                                                            {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
