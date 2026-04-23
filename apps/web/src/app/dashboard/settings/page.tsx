"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, saveBusiness, Business } from "@/lib/store";
import { Save, Copy, Check, Globe } from "lucide-react";

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

export default function SettingsPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    website: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const biz = getBusinessByOwner(user.id);
    if (biz) {
      setBusiness(biz);
      setForm({
        name: biz.name,
        category: biz.category,
        description: biz.description,
        phone: biz.phone,
        website: biz.website,
        address: biz.address,
      });
    }
  }, [user]);

  const setF =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    const updated = { ...business, ...form };
    saveBusiness(updated);
    setBusiness(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/business/${business?.slug}` : "";

  const copyLink = () => {
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

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your business profile and preferences
          </p>
        </div>

        {/* Public Link */}
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

        {/* Business Profile */}
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
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={setF("description")}
                rows={3}
                placeholder="Tell customers about your business..."
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
              />
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
                  Website
                </label>
                <input
                  value={form.website}
                  onChange={setF("website")}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
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
              onClick={() => startCheckout("starter")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Starter
            </button>
            <button
              onClick={() => startCheckout("pro")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => startCheckout("business")}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
            >
              Upgrade to Business
            </button>
            <button
              onClick={openPortal}
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
