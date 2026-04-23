"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getBusinessById,
  getReviewsByBusiness,
  saveBusiness,
  replyToReview,
  deleteReview,
  updateReviewStatus,
  Review,
  Business,
} from "@/lib/store";
import { generateAIReply } from "@/lib/ai-analysis";
import { ArrowLeft, Star, Send, Sparkles, X, Trash2, Archive, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminMerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyModal, setReplyModal] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [aiReplies, setAiReplies] = useState<{ text: string; tone: string }[]>([]);

  const refresh = () => {
    const biz = getBusinessById(id);
    if (biz) {
      setBusiness(biz);
      setReviews(getReviewsByBusiness(biz.id));
    }
  };
  useEffect(() => {
    refresh();
  }, [id]);

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

  if (!business)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

  return (
    <div className="h-screen overflow-y-auto p-8">
      <button
        onClick={() => router.push("/admin/merchants")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Merchants
      </button>

      {/* Business Header */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">
            {business.logo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">{business.name}</h1>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${business.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
              >
                {business.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {business.category} · {business.address}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {business.phone} · {business.website}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{avg}★</div>
            <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
            <Link
              href={`/business/${business.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              <Globe className="w-3 h-3" /> Public page
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-base font-semibold text-white mb-4">All Reviews ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500/40 to-orange-500/40 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {review.customerName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {review.customerName}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${review.status === "replied" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                  >
                    {review.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{review.text}</p>
                {review.reply && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
                    <p className="text-xs text-primary font-medium mb-1">
                      Reply · {review.repliedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.reply}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openReply(review)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />{" "}
                    {review.reply ? "Edit Reply" : "Reply as Admin"}
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
                      if (confirm("Delete?")) {
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
              <span className="text-sm font-medium">{replyModal.customerName}</span>
              <p className="text-xs text-muted-foreground mt-1">{replyModal.text}</p>
            </div>
            <div className="space-y-2 mb-3">
              {aiReplies.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(r.text)}
                  className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
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
