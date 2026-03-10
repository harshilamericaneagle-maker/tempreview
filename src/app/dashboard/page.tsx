"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getBusinessAnalytics, getReviewsByBusiness, Review, Business } from "@/lib/store";
import { replyToReview } from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import {
    Star, TrendingUp, MessageSquare, Clock, Zap, X, Send, Sparkles
} from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "star-filled fill-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
        </div>
    );
}

const SENTIMENT_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
    const { user, activeLocation } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [analytics, setAnalytics] = useState<ReturnType<typeof getBusinessAnalytics> | null>(null);
    const [recent, setRecent] = useState<Review[]>([]);
    const [replyModal, setReplyModal] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        setBusiness(biz);
        const stats = getBusinessAnalytics(biz.id, activeLocation?.id);
        setAnalytics(stats);
        setRecent(getReviewsByBusiness(biz.id).filter(r => !activeLocation || r.locationId === activeLocation.id).slice(0, 6));
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    const openReply = (review: Review) => {
        setReplyModal(review);
        setReplyText(review.reply || "");
        setAiReplies(generateAIReply(review));
    };

    const submitReply = () => {
        if (!replyModal || !replyText.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            replyToReview(replyModal.id, replyText, user?.name || "Owner");
            setReplyModal(null);
            setReplyText("");
            setSubmitting(false);
            refresh();
        }, 500);
    };

    if (!analytics || !business) {
        return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const sentimentData = [
        { name: "Positive", value: analytics.sentimentCounts.positive, color: "#22c55e" },
        { name: "Neutral", value: analytics.sentimentCounts.neutral, color: "#f59e0b" },
        { name: "Negative", value: analytics.sentimentCounts.negative, color: "#ef4444" },
    ];

    const statCards = [
        { label: "Total Reviews", value: analytics.total, icon: Star, color: "from-violet-500 to-purple-600", change: `+${analytics.newThisWeek} this week` },
        { label: "Average Rating", value: `${analytics.avgRating}★`, icon: TrendingUp, color: "from-cyan-500 to-blue-600", change: "Overall score" },
        { label: "Response Rate", value: `${analytics.responseRate}%`, icon: MessageSquare, color: "from-emerald-500 to-green-600", change: `${analytics.replied} replied` },
        { label: "Pending Replies", value: analytics.pending, icon: Clock, color: "from-amber-500 to-orange-500", change: "Needs attention" },
    ];

    return (
        <div className="h-screen overflow-y-auto">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{business.logo}</span>
                        <h1 className="text-2xl font-bold text-white">{business.name}</h1>
                    </div>
                    <p className="text-muted-foreground">{business.category} · {business.address}</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {statCards.map(({ label, value, icon: Icon, color, change }) => (
                        <div key={label} className="glass-card rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{value}</div>
                            <div className="text-sm font-medium text-muted-foreground mb-0.5">{label}</div>
                            <div className="text-xs text-muted-foreground/70">{change}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Rating Trend */}
                    <div className="col-span-2 glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Rating Trend (Last 8 Weeks)</h2>
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={analytics.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                                <YAxis domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", color: "#f1f5f9" }} />
                                <Line type="monotone" dataKey="avgRating" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} name="Avg Rating" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sentiment Donut */}
                    <div className="glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Sentiment Mix</h2>
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                                    {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", color: "#f1f5f9" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 mt-2">
                            {sentimentData.map(s => (
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

                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Recent Reviews */}
                    <div className="col-span-2 glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Reviews</h2>
                        <div className="space-y-3">
                            {recent.map(r => (
                                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                        {r.customerName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-sm font-medium text-foreground">{r.customerName}</span>
                                            <StarDisplay rating={r.rating} />
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                                    </div>
                                    {r.status === "pending" && (
                                        <button onClick={() => openReply(r)}
                                            className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                                            Reply
                                        </button>
                                    )}
                                    {r.status === "replied" && (
                                        <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Replied</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Keywords */}
                    <div className="glass-card rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Top Keywords</h2>
                        <div className="flex flex-wrap gap-2">
                            {analytics.topKeywords.slice(0, 12).map(({ word, count }) => (
                                <span key={word} className="px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20">
                                    {word} <span className="text-primary/60 ml-1">×{count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Reply to Review</h3>
                            <button onClick={() => setReplyModal(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">{replyModal.customerName}</span>
                                <StarDisplay rating={replyModal.rating} />
                            </div>
                            <p className="text-sm text-muted-foreground">{replyModal.text}</p>
                        </div>

                        {/* AI Suggestions */}
                        <div className="mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Suggested Replies
                            </div>
                            <div className="space-y-2">
                                {aiReplies.map((r, i) => (
                                    <button key={i} onClick={() => setReplyText(r.text)}
                                        className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                        <span className="text-xs text-purple-400 font-medium capitalize block mb-1">{r.tone}</span>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="Write your reply..."
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none mb-4" />

                        <button onClick={submitReply} disabled={submitting || !replyText.trim()}
                            className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                            <Send className="w-4 h-4" />
                            {submitting ? "Sending..." : "Send Reply"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
