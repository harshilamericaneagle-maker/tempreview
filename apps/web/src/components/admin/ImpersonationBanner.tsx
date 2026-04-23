"use client";

import { useEffect, useState } from "react";

type ImpersonationData = {
  tenantId: string;
  tenantName: string;
};

export default function ImpersonationBanner() {
  const [data, setData] = useState<ImpersonationData | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/impersonation");
    if (!res.ok) return;
    const json = (await res.json()) as { ok: boolean; data: ImpersonationData | null };
    if (json.ok) setData(json.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const stop = async () => {
    await fetch("/api/admin/impersonation", { method: "DELETE" });
    setData(null);
  };

  if (!data) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[70] rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200 backdrop-blur">
      Impersonating tenant: <span className="font-semibold">{data.tenantName}</span>
      <button
        onClick={stop}
        className="ml-3 rounded-md border border-amber-500/30 px-2 py-0.5 text-amber-100"
      >
        Stop
      </button>
    </div>
  );
}
