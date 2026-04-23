"use client";

import { useEffect, useState } from "react";
import { Save, Copy, Check, Globe } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "liquor", label: "Liquor Store" },
  { value: "clinic", label: "Clinic" },
  { value: "salon", label: "Salon" },
  { value: "hotel", label: "Hotel" },
  { value: "gym", label: "Gym" },
  { value: "cafe", label: "Cafe" },
  { value: "other", label: "Other" },
] as const;

type Category = (typeof CATEGORY_OPTIONS)[number]["value"];

type ProfileResponse = {
  tenant: {
    id: string;
    name: string;
    category: Category;
  };
  primaryLocation: {
    id: string;
    name: string;
    slug: string;
    address: string;
    phone: string | null;
  };
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "restaurant" as Category,
    phone: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/settings/profile");
    const json = (await res.json()) as { ok: boolean; data?: ProfileResponse };
    if (json.ok && json.data) {
      setProfile(json.data);
      setForm({
        name: json.data.tenant.name,
        category: json.data.tenant.category,
        phone: json.data.primaryLocation.phone ?? "",
        address: json.data.primaryLocation.address,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const setF =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = (await res.json()) as { ok: boolean; data?: ProfileResponse };
    if (json.ok && json.data) {
      setProfile(json.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const publicUrl =
    typeof window !== "undefined" && profile?.primaryLocation?.slug
      ? `${window.location.origin}/r/${profile.primaryLocation.slug}`
      : "";

  const copyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startCheckout = async (plan: "starter" | "pro" | "business") => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      data?: { url?: string };
      error?: { message?: string };
    };
    if (json.ok && json.data?.url) {
      window.location.href = json.data.url;
      return;
    }
    setBillingMessage(json.error?.message ?? "Unable to start checkout.");
  };

  const openPortal = async () => {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = (await res.json()) as {
      ok: boolean;
      data?: { url?: string };
      error?: { message?: string };
    };
    if (json.ok && json.data?.url) {
      window.location.href = json.data.url;
      return;
    }
    setBillingMessage(json.error?.message ?? "Unable to open billing portal.");
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your tenant profile and billing.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Your Public Review Page</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Share this link with customers so they can leave reviews for your business.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-muted-foreground font-mono truncate">
              {publicUrl || "Loading..."}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors text-xs font-medium flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-5">Business Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Business Name
                </label>
                <input
                  value={form.name}
                  onChange={setF("name")}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={setF("category")}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={setF("phone")}
                  placeholder="(312) 555-0100"
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Primary Location
                </label>
                <input
                  value={profile.primaryLocation.name}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/20 border border-border text-muted-foreground text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Address
              </label>
              <input
                value={form.address}
                onChange={setF("address")}
                required
                placeholder="123 Main St, City, State ZIP"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm transition-all"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-6 mt-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Billing</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Upgrade your plan or manage payment methods in Stripe.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => void startCheckout("starter")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Starter
            </button>
            <button
              onClick={() => void startCheckout("pro")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => void startCheckout("business")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Business
            </button>
            <button
              onClick={() => void openPortal()}
              className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs"
            >
              Open Billing Portal
            </button>
          </div>
          {billingMessage && <p className="text-xs text-amber-300 mt-3">{billingMessage}</p>}
        </div>
      </div>
    </div>
  );
}
