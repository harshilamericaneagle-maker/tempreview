"use client";
import { useEffect, useState } from "react";
import {
  getReviews,
  getBusinesses,
  replyToReview,
  deleteReview,
  updateReviewStatus,
  Review,
  Business,
} from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import { Search, Star, Send, Sparkles, X, Trash2, Flag, Archive } from "lucide-react";

const SENT_COLORS: Record<string, string> = {
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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [bizFilter, setBizFilter] = useState("all");
  const [replyModal, setReplyModal] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);

  const refresh = () => {
    setReviews(getReviews());
    setBusinesses(getBusinesses());
  };
  useEffect(() => {
    refresh();
  }, []);

  const filtered = reviews.filter((r) => {
    if (
      search &&
      !r.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !r.text.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (ratingFilter !== "all" && r.rating !== parseInt(ratingFilter)) return false;
    if (bizFilter !== "all" && r.businessId !== bizFilter) return false;
    return true;
  });

  const openReply = (r: Review) => {
    setReplyModal(r);
    setReplyText(r.reply || "");
    setAiReplies(generateAIReply(r));
  };

  const submitReply = () => {
    if (!replyModal || !replyText.trim()) return;
    replyToReview(replyModal.id, replyText, "Admin");
    setReplyModal(null);
    setReplyText("");
    refresh();
  };

  const getBizName = (id: string) => businesses.find((b) => b.id === id)?.name || "Unknown";

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">All Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filtered.length} reviews across all merchants
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <select
          value={bizFilter}
          onChange={(e) => setBizFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">All Merchants</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} Stars
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/40 to-orange-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {review.customerName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{review.customerName}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    {review.sentiment && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${SENT_COLORS[review.sentiment]}`}
                      >
                        {review.sentiment}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {getBizName(review.businessId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[review.status]}`}
                    >
                      {review.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{review.text}</p>
                {review.reply && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-primary mb-1">
                      Reply by {review.repliedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.reply}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openReply(review)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> {review.reply ? "Edit Reply" : "Reply"}
                  </button>
                  <button
                    onClick={() => {
                      updateReviewStatus(review.id, "flagged");
                      refresh();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <Flag className="w-3 h-3" /> Flag
                  </button>
                  <button
                    onClick={() => {
                      updateReviewStatus(review.id, "archived");
                      refresh();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors"
                  >
                    <Archive className="w-3 h-3" /> Archive
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete permanently?")) {
                        deleteReview(review.id);
                        refresh();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl text-muted-foreground">
            No reviews found.
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Admin Reply</h3>
              <button onClick={() => setReplyModal(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{replyModal.customerName}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i <= replyModal.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{replyModal.text}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
              </div>
              {aiReplies.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(r.text)}
                  className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors mb-2"
                >
                  <span className="text-xs text-purple-400 font-medium capitalize block mb-1">
                    {r.tone}
                  </span>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                </button>
              ))}
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary text-sm resize-none mb-4"
            />
            <button
              onClick={submitReply}
              disabled={!replyText.trim()}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
