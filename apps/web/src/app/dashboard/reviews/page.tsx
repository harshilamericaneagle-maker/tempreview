"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Star, Search, Send, Sparkles, X, Archive, MessageSquare } from "lucide-react";

type ReviewItem = {
  id: string;
  provider: "google" | "yelp" | "facebook" | "native";
  rating: number;
  body: string;
  authorName: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  status: "new" | "read" | "flagged" | "resolved";
  postedAt: string;
  locationId: string;
  locationName: string;
  latestReply: { id: string; body: string; status: string } | null;
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  negative: "bg-red-500/10 text-red-400 border-red-500/20",
  neutral: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  resolved: "bg-emerald-500/10 text-emerald-400",
  new: "bg-amber-500/10 text-amber-400",
  flagged: "bg-red-500/10 text-red-400",
  read: "bg-secondary text-muted-foreground",
};

export default function ReviewsPage() {
  const { activeLocation } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filtered, setFiltered] = useState<ReviewItem[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [replyModal, setReplyModal] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedTone, setSelectedTone] = useState<
    "Professional" | "Warm" | "Apologetic" | "Brief"
  >("Professional");
  const [submitting, setSubmitting] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const refresh = async () => {
    const params = new URLSearchParams();
    if (activeLocation?.id) params.set("locationId", activeLocation.id);
    const res = await fetch(`/api/reviews?${params.toString()}`);
    const json = (await res.json()) as { ok: boolean; data: ReviewItem[] };
    if (json.ok) {
      setReviews(json.data);
      setFiltered(json.data);
    }
  };

  useEffect(() => {
    void refresh();
  }, [activeLocation]);

  useEffect(() => {
    let r = [...reviews];
    if (search) {
      r = r.filter(
        (rv) =>
          rv.authorName.toLowerCase().includes(search.toLowerCase()) ||
          rv.body.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (ratingFilter !== "all") r = r.filter((rv) => rv.rating === parseInt(ratingFilter, 10));
    if (statusFilter !== "all") r = r.filter((rv) => rv.status === statusFilter);
    if (sourceFilter !== "all") r = r.filter((rv) => rv.provider === sourceFilter);
    setFiltered(r);
  }, [search, ratingFilter, statusFilter, sourceFilter, reviews]);

  const openReply = (review: ReviewItem) => {
    setReplyModal(review);
    setReplyText(review.latestReply?.body || "");
  };

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

  const handleStatus = async (id: string, status: ReviewItem["status"]) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Stars
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
          >
            <option value="all">Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="flagged">Flagged</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
          >
            <option value="all">Source</option>
            <option value="google">Google</option>
            <option value="yelp">Yelp</option>
            <option value="facebook">Facebook</option>
            <option value="native">Native</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {review.authorName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">{review.authorName}</span>
                      <StarDisplay rating={review.rating} />
                      {review.sentiment && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${SENTIMENT_COLORS[review.sentiment]}`}
                        >
                          {review.sentiment}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 border border-border text-muted-foreground">
                        {review.provider}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[review.status]}`}
                      >
                        {review.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.postedAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{review.body}</p>
                  <p className="text-xs text-muted-foreground mb-3">{review.locationName}</p>

                  {review.latestReply && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
                      <div className="text-xs text-primary font-medium mb-1">Latest Reply</div>
                      <p className="text-xs text-muted-foreground">{review.latestReply.body}</p>
                    </div>
                  )}

                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => openReply(review)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      {review.latestReply ? "Edit Reply" : "Reply"}
                    </button>

                    <button
                      onClick={() => void handleStatus(review.id, "flagged")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors"
                    >
                      Flag
                    </button>

                    {review.status !== "resolved" && (
                      <button
                        onClick={() => void handleStatus(review.id, "resolved")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:text-foreground transition-colors ml-auto"
                      >
                        <Archive className="w-3 h-3" /> Resolve
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

      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Reply to Review</h3>
              <button onClick={() => setReplyModal(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{replyModal.authorName}</span>
                <StarDisplay rating={replyModal.rating} />
              </div>
              <p className="text-xs text-muted-foreground">{replyModal.body}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Reply Assistant
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
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none mb-4"
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
