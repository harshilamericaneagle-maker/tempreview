"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Star } from "lucide-react";
import { useAuth } from "@/lib/auth";

const CATEGORIES = [
  "restaurant",
  "retail",
  "liquor",
  "clinic",
  "salon",
  "hotel",
  "gym",
  "cafe",
  "other",
] as const;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    category: "restaurant",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: form.name,
          tenantName: form.businessName,
          category: form.category,
          email: form.email,
          password: form.password,
          phone: form.phone || null,
          address: form.address || null,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message || "Registration failed.");
      }

      const result = await login(form.email, form.password);
      if (!result.success) {
        throw new Error("Account created but sign in failed. Please sign in manually.");
      }

      router.push("/app");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-primary">ReviewHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Register your business</h1>
          <p className="text-muted-foreground">Start collecting and managing reviews in minutes</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
              />
              <input
                value={form.businessName}
                onChange={set("businessName")}
                placeholder="Business Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
              />
            </div>

            <select
              value={form.category}
              onChange={set("category")}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="Password"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
              />
              <input
                value={form.phone}
                onChange={set("phone")}
                placeholder="Phone"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
              />
            </div>

            <input
              value={form.address}
              onChange={set("address")}
              placeholder="Business Address"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <Building2 className="w-4 h-4" />
              {loading ? "Creating account..." : "Create Business Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
