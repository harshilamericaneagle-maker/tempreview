"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessBySlug, getReviewsByBusiness, addReview, Business, Review } from "@/lib/store";
import { Star, MapPin, Phone, Globe, ChevronLeft, Send, X } from "lucide-react";
import Link from "next/link";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${n <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const SENT_COLORS: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center font-bold text-white flex-shrink-0">
          {review.customerName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-foreground">{review.customerName}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
          {review.sentiment && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${SENT_COLORS[review.sentiment]} mb-2 inline-block`}
            >
              {review.sentiment}
            </span>
          )}
          <p className="text-sm text-muted-foreground mb-3">{review.text}</p>
          {review.reply && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-medium text-primary mb-1">
                Response from owner · {review.repliedBy}
              </p>
              <p className="text-xs text-muted-foreground">{review.reply}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground/50 mt-2">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function InlineFeedbackBox({
  business,
  onSubmitted,
}: {
  business: Business;
  onSubmitted: () => void;
}) {
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMsg, setFbMsg] = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbDone, setFbDone] = useState(false);

  const handleFbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbMsg.trim()) return;
    setFbSubmitting(true);
    setTimeout(() => {
      addReview({
        businessId: business.id,
        customerName: fbName.trim(),
        customerEmail: fbEmail.trim() || undefined,
        rating: 3,
        text: fbMsg.trim(),
        source: "Direct Feedback",
      });
      setFbDone(true);
      setFbSubmitting(false);
      onSubmitted();
    }, 600);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border mt-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Share Your Feedback</h3>
          <p className="text-xs text-muted-foreground">
            Sent directly to management — not published publicly
          </p>
        </div>
      </div>

      {fbDone ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-white font-semibold mb-1">Feedback Received!</p>
          <p className="text-sm text-muted-foreground">
            Thank you for helping {business.name} improve.
          </p>
        </div>
      ) : (
        <form onSubmit={handleFbSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Your Name *
              </label>
              <input
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email (optional)
              </label>
              <input
                type="email"
                value={fbEmail}
                onChange={(e) => setFbEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Your Message *
            </label>
            <textarea
              value={fbMsg}
              onChange={(e) => setFbMsg(e.target.value)}
              required
              rows={4}
              placeholder="Tell us about your experience, suggestions, or anything you'd like management to know..."
              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={fbSubmitting || !fbName.trim() || !fbMsg.trim()}
            className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            <Send className="w-4 h-4" />
            {fbSubmitting ? "Sending..." : "Send to Management"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [gateStep, setGateStep] = useState<"rating" | "form" | "public_links">("rating");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", rating: 0, text: "" });
  const [submitting, setSubmitting] = useState(false);

  const openForm = () => {
    setShowForm(true);
    setSubmitted(false);
    setForm({ customerName: "", customerEmail: "", rating: 0, text: "" });
  };

  const refresh = () => {
    const biz = getBusinessBySlug(slug);
    if (biz) {
      setBusiness(biz);
      setReviews(
        getReviewsByBusiness(biz.id).filter(
          (r) => r.status !== "archived" && r.status !== "flagged",
        ),
      );
    }
  };

  useEffect(() => {
    refresh();
  }, [slug]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const ratingDist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !form.rating) return;
    setSubmitting(true);
    setTimeout(() => {
      addReview({
        businessId: business.id,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        rating: form.rating,
        text: form.text,
        source: "Direct",
      });
      setSubmitted(true);
      setSubmitting(false);
      refresh();
    }, 800);
  };

  if (!business)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-muted-foreground">Business not found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        {/* Business Header */}
        <div className="glass-card rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl flex-shrink-0">
              {business.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{business.name}</h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full badge-glow">
                    {business.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{avgRating}</div>
                  <div className="flex gap-0.5 justify-end my-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= parseFloat(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
                </div>
              </div>
              {business.description && (
                <p className="text-sm text-muted-foreground mt-3">{business.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                {business.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {business.address}
                  </span>
                )}
                {business.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {business.phone}
                  </span>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {business.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="space-y-2">
              {ratingDist.map(({ n, count }) => {
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8 text-right">{n}★</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-400/80 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={openForm}
            className="mt-6 w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <Star className="w-4 h-4 fill-white" /> Write a Review
          </button>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-muted-foreground">No reviews yet. Be the first!</p>
            </div>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </div>

        {/* Inline Feedback Box */}
        <InlineFeedbackBox business={business} onSubmitted={refresh} />
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Your review has been submitted successfully.
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Write a Review</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{business.name}</p>
                  </div>
                  <button onClick={() => setShowForm(false)}>
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Stars */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      <StarPicker
                        value={form.rating}
                        onChange={(r: number) => setForm((f) => ({ ...f, rating: r }))}
                      />
                      {form.rating > 0 && (
                        <span className="ml-2 text-sm text-yellow-400 font-medium">
                          {["Terrible", "Poor", "Okay", "Good", "Excellent!"][form.rating - 1]}
                        </span>
                      )}
                    </div>
                    {form.rating === 0 && (
                      <p className="text-xs text-muted-foreground/60 mt-1">Click a star to rate</p>
                    )}
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Your Name *
                      </label>
                      <input
                        value={form.customerName}
                        onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                        required
                        placeholder="Jane Smith"
                        className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={form.customerEmail}
                        onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Your Review *
                    </label>
                    <textarea
                      value={form.text}
                      onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                      required
                      rows={4}
                      placeholder="Tell us about your experience — what did you love? What could be better?"
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !form.customerName || !form.text || form.rating === 0}
                    className="w-full py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
