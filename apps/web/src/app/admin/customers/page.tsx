"use client";
import { useEffect, useState } from "react";
import { getBusinessByOwner, getReviews, getUsers, User } from "@/lib/store";
import { Search, Star, Mail, Calendar } from "lucide-react";

interface CustomerRow {
  name: string;
  email: string;
  reviewCount: number;
  avgRating: number;
  lastActive: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const reviews = getReviews();
    // Aggregate unique customers from reviews
    const map: Record<string, { reviews: typeof reviews }> = {};
    reviews.forEach((r) => {
      const key = r.customerEmail || r.customerName;
      if (!map[key]) map[key] = { reviews: [] };
      map[key].reviews.push(r);
    });
    const rows: CustomerRow[] = Object.entries(map).map(([key, { reviews: rs }]) => ({
      name: rs[0].customerName,
      email: rs[0].customerEmail || "Not provided",
      reviewCount: rs.length,
      avgRating: parseFloat((rs.reduce((s, r) => s + r.rating, 0) / rs.length).toFixed(1)),
      lastActive: rs.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0].createdAt,
    }));
    setCustomers(rows.sort((a, b) => b.reviewCount - a.reviewCount));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen overflow-y-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {customers.length} unique reviewers on the platform
        </p>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                Email
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                Reviews
              </th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                Avg Rating
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-cyan-500/40 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {c.email}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-foreground">{c.reviewCount}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star
                      className={`w-3.5 h-3.5 ${c.avgRating >= 4 ? "fill-yellow-400 text-yellow-400" : c.avgRating >= 3 ? "text-amber-400" : "text-red-400"}`}
                    />
                    <span className="text-sm font-medium text-foreground">{c.avgRating}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.lastActive).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No customers found.</div>
        )}
      </div>
    </div>
  );
}
