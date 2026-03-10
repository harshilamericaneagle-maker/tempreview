"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getStaffStats, Business } from "@/lib/store";
import { Trophy, Medal, Star, CheckCircle2, TrendingUp, Users } from "lucide-react";

export default function TeamLeaderboardPage() {
    const { user, activeLocation } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [stats, setStats] = useState<ReturnType<typeof getStaffStats>>([]);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        setBusiness(biz);

        // Fetch all staff stats. In a real app, we might filter by location if staff are location-bound.
        setStats(getStaffStats(biz.id));
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    if (!business) {
        return <div className="flex items-center justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    }

    const topRankColors = [
        "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",   // 1st: Gold
        "text-slate-300 bg-slate-300/10 border-slate-300/30",       // 2nd: Silver
        "text-amber-600 bg-amber-600/10 border-amber-600/30"        // 3rd: Bronze
    ];

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Team & Leaderboard</h1>
                    <p className="text-muted-foreground text-sm">Track staff performance, tasks resolved, and positive guest mentions.</p>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex flex-shrink-0 items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Tasks Resolved</p>
                        <p className="text-2xl font-bold text-white">{stats.reduce((acc, s) => acc + s.tasksResolved, 0)}</p>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex flex-shrink-0 items-center justify-center border border-blue-500/20">
                        <Star className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">5★ Reviews Handled</p>
                        <p className="text-2xl font-bold text-white">{stats.reduce((acc, s) => acc + s.positiveReviewsHandled, 0)}</p>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex flex-shrink-0 items-center justify-center border border-purple-500/20">
                        <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Team Members</p>
                        <p className="text-2xl font-bold text-white">{stats.length}</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table/Cards */}
            {stats.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No staff members found. Invite your team in Settings.</div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden border border-border">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/30 border-b border-border text-xs font-bold text-muted-foreground tracking-wider uppercase">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-4">Team Member</div>
                        <div className="col-span-2 text-center">Overall Points</div>
                        <div className="col-span-2 text-center">Tasks Resolved</div>
                        <div className="col-span-3 text-center">Positive Guest Mentions</div>
                    </div>

                    <div className="divide-y divide-border/50">
                        {stats.map((stat, i) => {
                            const rankStyle = i < 3 ? topRankColors[i] : "text-muted-foreground border-transparent";
                            return (
                                <div key={stat.user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-sm ${rankStyle}`}>
                                            {i === 0 ? <Trophy className="w-4 h-4" /> : i < 3 ? <Medal className="w-4 h-4" /> : `#${i + 1}`}
                                        </div>
                                    </div>
                                    <div className="col-span-4 flex flex-col">
                                        <span className="font-bold text-white text-sm">{stat.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{stat.user.role}</span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary/10 text-primary font-bold text-sm border border-primary/20 hover:scale-105 transition-transform">
                                            {stat.points} pt
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center text-sm font-medium text-white">
                                        {stat.tasksResolved}
                                        {stat.tasksPending > 0 && <span className="text-xs text-muted-foreground ml-1">({stat.tasksPending} limit)</span>}
                                    </div>
                                    <div className="col-span-3 text-center text-sm text-white flex items-center justify-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                                        <span>{stat.positiveReviewsHandled} mentions</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
