"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
    getBusinessByOwner, getReviewsByBusiness, Review, replyToReview,
    updateReviewStatus, deleteReview, getUsers
} from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import { Star, Search, Filter, Send, Sparkles, X, Trash2, Archive, Flag, MessageSquare, AlertCircle, UserPlus } from "lucide-react";

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
            ))}
        </div>
    );
}

const SENTINEL_COLORS: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATUS_COLORS: Record<string, string> = {
    replied: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    flagged: "bg-red-500/10 text-red-400",
    archived: "bg-secondary text-muted-foreground",
};

export default function ReviewsPage() {
    const { user, activeLocation } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filtered, setFiltered] = useState<Review[]>([]);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [urgencyFilter, setUrgencyFilter] = useState("all");
    const [replyModal, setReplyModal] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);

    const refresh = () => {
        if (!user) return;
        const biz = getBusinessByOwner(user.id);
        if (!biz) return;
        const all = getReviewsByBusiness(biz.id).filter(r => !activeLocation || r.locationId === activeLocation.id);
        const allUsers = getUsers().map(u => ({ id: u.id, name: u.name }));
        setReviews(all);
        setFiltered(all);
        setUsers(allUsers);
    };

    useEffect(() => { refresh(); }, [user, activeLocation]);

    useEffect(() => {
        let r = [...reviews];
        if (search) r = r.filter(rv => rv.customerName.toLowerCase().includes(search.toLowerCase()) || rv.text.toLowerCase().includes(search.toLowerCase()));
        if (ratingFilter !== "all") r = r.filter(rv => rv.rating === parseInt(ratingFilter));
        if (statusFilter !== "all") r = r.filter(rv => rv.status === statusFilter);
        if (sourceFilter !== "all") r = r.filter(rv => rv.source === sourceFilter);
        if (urgencyFilter === "urgent") r = r.filter(rv => rv.isUrgent);
        setFiltered(r);
    }, [search, ratingFilter, statusFilter, sourceFilter, urgencyFilter, reviews]);

    const openReply = (r: Review) => {
        setReplyModal(r);
        setReplyText(r.reply || "");
        setAiReplies(generateAIReply(r));
    };

    const submitReply = () => {
        if (!replyModal || !replyText.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            replyToReview(replyModal.id, replyText, user?.name || "Owner");
            setReplyModal(null); setReplyText(""); setSubmitting(false); refresh();
        }, 500);
    };

    const handleStatus = (id: string, status: Review["status"]) => {
        updateReviewStatus(id, status); refresh();
    };

    const toggleUrgent = (id: string) => {
        const reviews = JSON.parse(localStorage.getItem("rms_reviews") || "[]") as Review[];
        const idx = reviews.findIndex(r => r.id === id);
        if (idx !== -1) {
            reviews[idx].isUrgent = !reviews[idx].isUrgent;
            localStorage.setItem("rms_reviews", JSON.stringify(reviews));
            refresh();
        }
    };

    const handleAssign = (reviewId: string, userId: string) => {
        const reviews = JSON.parse(localStorage.getItem("rms_reviews") || "[]") as Review[];
        const idx = reviews.findIndex(r => r.id === reviewId);
        if (idx !== -1) {
            reviews[idx].assignedTo = userId || undefined;
            localStorage.setItem("rms_reviews", JSON.stringify(reviews));
            refresh();
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this review permanently?")) { deleteReview(id); refresh(); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="h-screen overflow-y-auto">
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Reviews</h1>
                    <p className="text-muted-foreground text-sm mt-1">{filtered.length} reviews found</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm" />
                    </div>
                    <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm">
                        <option value="all">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm">
                        <option value="all">Status</option>
                        <option value="pending">Pending</option>
                        <option value="replied">Replied</option>
                    </select>
                    <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm">
                        <option value="all">Source</option>
                        <option value="Google">Google</option>
                        <option value="TripAdvisor">TripAdvisor</option>
                        <option value="Expedia">Expedia</option>
                        <option value="Booking.com">Booking.com</option>
                    </select>
                    <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm">
                        <option value="all">Urgency</option>
                        <option value="urgent">Urgent Only</option>
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filtered.map(review => (
                        <div key={review.id} className="glass-card rounded-2xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {review.customerName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-foreground">{review.customerName}</span>
                                            <StarDisplay rating={review.rating} />
                                            {review.sentiment && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${SENTINEL_COLORS[review.sentiment]}`}>
                                                    {review.sentiment}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {review.isUrgent && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold tracking-wider uppercase flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Urgent
                                                </span>
                                            )}
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 border border-border text-muted-foreground">
                                                {review.source}
                                            </span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[review.status]}`}>
                                                {review.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{review.text}</p>

                                    {review.reply && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
                                            <div className="text-xs text-primary font-medium mb-1">Your Reply · {review.repliedBy}</div>
                                            <p className="text-xs text-muted-foreground">{review.reply}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center flex-wrap gap-2">
                                        <button onClick={() => openReply(review)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                                            <MessageSquare className="w-3 h-3" />
                                            {review.reply ? "Edit Reply" : "Reply"}
                                        </button>

                                        <button onClick={() => toggleUrgent(review.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${review.isUrgent ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}>
                                            <AlertCircle className="w-3 h-3" /> {review.isUrgent ? "Remove Urgent" : "Mark Urgent"}
                                        </button>

                                        <div className="relative group/assign">
                                            <select
                                                value={review.assignedTo || ""}
                                                onChange={(e) => handleAssign(review.id, e.target.value)}
                                                className="flex items-center gap-1.5 px-8 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="">Assign To...</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                            <UserPlus className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        </div>

                                        {review.status !== "archived" && (
                                            <button onClick={() => handleStatus(review.id, "archived")}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors ml-auto">
                                                <Archive className="w-3 h-3" /> Archive
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-16 glass-card rounded-2xl">
                            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No reviews found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Reply to Review</h3>
                            <button onClick={() => setReplyModal(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{replyModal.customerName}</span>
                                <StarDisplay rating={replyModal.rating} />
                            </div>
                            <p className="text-xs text-muted-foreground">{replyModal.text}</p>
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-2">
                                <Sparkles className="w-3.5 h-3.5" /> AI Suggested Replies
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
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
                            placeholder="Write your reply..."
                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none mb-4" />
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
