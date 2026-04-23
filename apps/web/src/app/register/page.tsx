"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Building2 } from "lucide-react";
import { createUser, saveBusiness, getBusinesses } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const CATEGORIES = [
  "Restaurant",
  "Retail",
  "Liquor Store",
  "Clinic",
  "Salon",
  "Hotel",
  "Gym",
  "Cafe",
  "Other",
];

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    category: "Restaurant",
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
      const slug = form.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const bizId = `biz-${Date.now()}`;

      const user = createUser({
        email: form.email,
        password: form.password,
        name: form.name,
        role: "merchant",
        businessId: bizId,
      });

      saveBusiness({
        id: bizId,
        slug,
        name: form.businessName,
        category: form.category,
        description: "",
        phone: form.phone,
        website: "",
        address: form.address,
        logo: "🏪",
        ownerId: user.id,
        status: "active",
        createdAt: new Date().toISOString(),
      });

      await login(form.email, form.password);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 mesh-gradient" />
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />

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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your Name
                </label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Smith"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Business Name
                </label>
                <input
                  value={form.businessName}
                  onChange={set("businessName")}
                  placeholder="My Awesome Cafe"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Business Category
              </label>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@business.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="(312) 555-0100"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Business Address
              </label>
              <input
                value={form.address}
                onChange={set("address")}
                placeholder="123 Main St, Chicago, IL 60601"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

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
