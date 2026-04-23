"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

type PublicData = {
  location: { id: string; name: string; slug: string; address: string };
  tenant: { id: string; name: string; category: string };
  links: { google: string | null; yelp: string | null };
};

export default function PublicReviewPage() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/r/${params.slug}`);
      const json = (await res.json()) as { ok: boolean; data: PublicData };
      setData(json.data);
      setIsLoading(false);
    };
    void load();
  }, [params.slug]);

  const submit = async () => {
    if (!data || rating < 1 || !name || !body) return;

    if (rating >= 4) {
      const target = data.links.google ?? data.links.yelp;
      if (target) {
        window.location.href = target;
        return;
      }
    }

    const res = await fetch(`/api/r/${params.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: email || undefined,
        phone: phone || undefined,
        rating,
        body,
      }),
    });
    const json = (await res.json()) as { ok: boolean; error?: { message?: string } };
    setMessage(
      json.ok ? "Thanks for your feedback." : (json.error?.message ?? "Submission failed."),
    );
  };

  if (isLoading || !data)
    return <main className="min-h-screen grid place-items-center">Loading...</main>;

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <section className="w-full max-w-xl glass-card rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">{data.tenant.name}</h1>
        <p className="text-sm text-muted-foreground">{data.location.name}</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}>
              <Star
                className={`w-7 h-7 ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
              />
            </button>
          ))}
        </div>

        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border"
        />
        <input
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border"
        />
        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border"
        />
        <textarea
          placeholder="Tell us about your experience"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border"
          rows={4}
        />

        <button
          onClick={submit}
          className="w-full py-3 rounded-xl btn-primary text-white font-semibold"
        >
          {rating >= 4 ? "Continue to public review" : "Submit private feedback"}
        </button>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </section>
    </main>
  );
}
