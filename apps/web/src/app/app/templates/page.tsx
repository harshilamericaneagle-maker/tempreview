"use client";

import { useEffect, useState } from "react";

type Template = {
  id: string;
  channel: "sms" | "email";
  subject?: string | null;
  body: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [channel, setChannel] = useState<"sms" | "email">("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    const res = await fetch("/api/templates");
    const json = (await res.json()) as { ok: boolean; data: Template[] };
    if (json.ok) setTemplates(json.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel,
        subject: channel === "email" ? subject : undefined,
        body,
        variables: [],
      }),
    });
    setSubject("");
    setBody("");
    void load();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Templates</h1>
      <div className="glass-card rounded-xl p-4 space-y-3">
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as "sms" | "email")}
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        {channel === "email" && (
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border"
          />
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        />
        <button onClick={create} className="px-4 py-2 rounded-lg btn-primary text-white">
          Create Template
        </button>
      </div>
      <div className="space-y-2">
        {templates.map((t) => (
          <div key={t.id} className="glass-card rounded-xl p-4">
            <div className="text-xs uppercase text-muted-foreground">{t.channel}</div>
            <div className="font-medium">{t.subject || "(No subject)"}</div>
            <div className="text-sm text-muted-foreground">{t.body}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
