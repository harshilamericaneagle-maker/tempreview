"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type TenantRow = {
  id: string;
  name: string;
  plan: string;
  status: string;
  locations: number;
  users: number;
  mrr: number;
  aiSpend: number;
};

export default function AdminTenantsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tenants");
    const json = (await res.json()) as { ok: boolean; data: TenantRow[] };
    if (json.ok) setTenants(json.data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const totalMrr = useMemo(() => tenants.reduce((sum, t) => sum + t.mrr, 0), [tenants]);

  const suspendToggle = async (id: string) => {
    await fetch(`/api/admin/tenants/${id}/suspend`, { method: "POST" });
    void load();
  };

  const impersonate = async (id: string) => {
    const res = await fetch(`/api/admin/tenants/${id}/impersonate`, { method: "POST" });
    const json = (await res.json()) as { ok: boolean };
    if (json.ok) router.push("/app");
  };

  return (
    <main className="p-8 h-screen overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tenants</h1>
        <p className="text-sm text-muted-foreground">MRR: ${totalMrr.toFixed(2)} / month</p>
      </div>

      <div className="glass-card rounded-2xl p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading tenants...</p>
        ) : (
          <div className="space-y-2">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="rounded-xl border border-border p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-semibold text-white">{tenant.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Plan: {tenant.plan} · Status: {tenant.status} · Locations: {tenant.locations} ·
                    Users: {tenant.users}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    MRR: ${tenant.mrr.toFixed(2)} · AI Spend: ${tenant.aiSpend.toFixed(4)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => impersonate(tenant.id)}
                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs"
                  >
                    Impersonate
                  </button>
                  <button
                    onClick={() => suspendToggle(tenant.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs"
                  >
                    {tenant.status === "suspended" ? "Activate" : "Suspend"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
