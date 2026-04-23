"use client";
import { useEffect, useState } from "react";
import {
  getBusinesses,
  getReviews,
  getUsers,
  updateBusinessStatus,
  Business,
  Review,
} from "@/lib/store";
import { Search, Eye, ShieldOff, ShieldCheck, Star, Building2 } from "lucide-react";
import Link from "next/link";

export default function AdminMerchantsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");

  const refresh = () => setBusinesses(getBusinesses());
  useEffect(() => {
    refresh();
  }, []);

  const toggleStatus = (id: string, status: "active" | "suspended") => {
    updateBusinessStatus(id, status === "active" ? "suspended" : "active");
    refresh();
  };

  const filtered = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()),
  );

  const allReviews = getReviews();

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Merchants</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {businesses.length} businesses registered
          </p>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search merchants..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((biz) => {
          const bizReviews = allReviews.filter((r) => r.businessId === biz.id);
          const avg = bizReviews.length
            ? (bizReviews.reduce((s, r) => s + r.rating, 0) / bizReviews.length).toFixed(1)
            : "N/A";
          const replied = bizReviews.filter((r) => r.status === "replied").length;
          const pending = bizReviews.filter((r) => r.status === "pending").length;

          return (
            <div key={biz.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
                  {biz.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{biz.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${biz.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                    >
                      {biz.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {biz.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {biz.address} · {biz.phone}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {avg} avg
                    </span>
                    <span>{bizReviews.length} reviews</span>
                    <span className="text-emerald-400">{replied} replied</span>
                    <span className="text-amber-400">{pending} pending</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/business/${biz.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-secondary/50 border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link
                    href={`/admin/merchants/${biz.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" /> Manage
                  </Link>
                  <button
                    onClick={() => toggleStatus(biz.id, biz.status)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-colors ${
                      biz.status === "active"
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                  >
                    {biz.status === "active" ? (
                      <>
                        <ShieldOff className="w-3.5 h-3.5" /> Suspend
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" /> Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
