"use client";

import { useEffect, useState } from "react";

type Template = { id: string; channel: "sms" | "email"; subject?: string | null };
type Campaign = { id: string; name: string; status: string; trigger: string; templateId: string };

export default function CampaignsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");

  const load = async () => {
    const [templatesRes, campaignsRes] = await Promise.all([
      fetch("/api/templates"),
      fetch("/api/campaigns"),
    ]);
    const templatesJson = (await templatesRes.json()) as { ok: boolean; data: Template[] };
    const campaignsJson = (await campaignsRes.json()) as { ok: boolean; data: Campaign[] };
    if (templatesJson.ok) {
      setTemplates(templatesJson.data);
      if (!templateId && templatesJson.data[0]) setTemplateId(templatesJson.data[0].id);
    }
    if (campaignsJson.ok) setCampaigns(campaignsJson.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, templateId, trigger: "manual", status: "draft" }),
    });
    setName("");
    void load();
  };

  const runNow = async (id: string) => {
    await fetch(`/api/campaigns/${id}/run`, { method: "POST" });
    void load();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Campaigns</h1>
      <div className="glass-card rounded-xl p-4 flex gap-3 items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Campaign name"
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        />
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {(t.subject || "Template") + ` (${t.channel})`}
            </option>
          ))}
        </select>
        <button onClick={create} className="px-4 py-2 rounded-lg btn-primary text-white">
          Create
        </button>
      </div>
      <div className="space-y-2">
        {campaigns.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.status}</div>
            </div>
            <button
              onClick={() => runNow(c.id)}
              className="px-3 py-2 rounded-lg bg-secondary border border-border"
            >
              Run now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
