"use client";

import { useEffect, useMemo, useState } from "react";
import { Smartphone, Mail, QrCode, Plus, Play, Pause, X, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type Template = { id: string; channel: "sms" | "email"; subject?: string | null; body: string };
type Campaign = {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  templateId: string;
  template?: Template;
};
type Location = { id: string; name: string; slug: string };

export default function RequestsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [flyerText, setFlyerText] = useState(
    "We'd love your feedback! Scan the QR Code below to leave a review.",
  );
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "email" as "email" | "sms",
    templateSubject: "How was your stay?",
    templateBody: "Hi there! We hope you enjoyed your recent visit. We'd love your feedback.",
  });

  const primaryLocation = locations[0] ?? null;
  const reviewLink = useMemo(() => {
    if (!primaryLocation) return "";
    return `${typeof window !== "undefined" ? window.location.origin : ""}/r/${primaryLocation.slug}`;
  }, [primaryLocation]);

  const refresh = async () => {
    const [templatesRes, campaignsRes, locationsRes] = await Promise.all([
      fetch("/api/templates"),
      fetch("/api/campaigns"),
      fetch("/api/locations"),
    ]);
    const templatesJson = (await templatesRes.json()) as { ok: boolean; data: Template[] };
    const campaignsJson = (await campaignsRes.json()) as { ok: boolean; data: Campaign[] };
    const locationsJson = (await locationsRes.json()) as { ok: boolean; data: Location[] };

    if (templatesJson.ok) setTemplates(templatesJson.data);
    if (campaignsJson.ok) setCampaigns(campaignsJson.data);
    if (locationsJson.ok) setLocations(locationsJson.data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    const templateRes = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: newCampaign.channel,
        subject: newCampaign.channel === "email" ? newCampaign.templateSubject : undefined,
        body: newCampaign.templateBody,
        variables: ["name", "location", "review_link"],
      }),
    });
    const templateJson = (await templateRes.json()) as { ok: boolean; data?: Template };
    if (!templateJson.ok || !templateJson.data) return;

    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCampaign.name,
        templateId: templateJson.data.id,
        trigger: "manual",
        status: "active",
      }),
    });

    setShowModal(false);
    setNewCampaign({
      name: "",
      channel: "email",
      templateSubject: "How was your stay?",
      templateBody: "Hi there! We hope you enjoyed your recent visit. We'd love your feedback.",
    });
    await refresh();
  };

  const handleToggle = async (id: string, currentStatus: Campaign["status"]) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    await fetch(`/api/campaigns/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await refresh();
  };

  const channelDetails = {
    email: { icon: Mail, label: "Email Automation" },
    sms: { icon: Smartphone, label: "SMS Automation" },
  };

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Review Requests</h1>
          <p className="text-muted-foreground text-sm">
            Automate sending review invitations to recent guests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFlyerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white border border-border rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Printable Flyer
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Campaigns Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Create your first automated email or SMS campaign to start requesting more reviews.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Create Automation
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((camp) => {
            const channel = camp.template?.channel ?? "email";
            const Icon = channelDetails[channel].icon;
            const isActive = camp.status === "active";
            return (
              <div
                key={camp.id}
                className="glass-card rounded-2xl p-5 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white">{camp.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground uppercase"}`}
                      >
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground/80">
                      Sends via <span className="capitalize text-white">{channel}</span> using
                      template messaging.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void handleToggle(camp.id, camp.status)}
                    className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-white transition-colors"
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCampaign}
            className="glass-card rounded-2xl p-6 w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Create Automation</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Campaign Name
                </label>
                <input
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  type="text"
                  placeholder="e.g. Post-Checkout Email"
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Channel
                </label>
                <select
                  value={newCampaign.channel}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, channel: e.target.value as "email" | "sms" })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              {newCampaign.channel === "email" && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Email Subject
                  </label>
                  <input
                    required
                    value={newCampaign.templateSubject}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, templateSubject: e.target.value })
                    }
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={4}
                  value={newCampaign.templateBody}
                  onChange={(e) => setNewCampaign({ ...newCampaign, templateBody: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Review link will be automatically appended to the end.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90"
              >
                Activate Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {showFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print-modal">
          <style>{`@media print { body * { visibility: hidden; } #printable-flyer, #printable-flyer * { visibility: visible; } #printable-flyer { position: absolute; left: 0; top: 0; width: 100vw !important; height: 100vh !important; border: none !important; border-radius: 0 !important; } }`}</style>
          <div className="glass-card rounded-2xl p-6 w-full max-w-3xl border border-border flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" /> QR Code Flyer
                </h3>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Headline Text
                </label>
                <textarea
                  rows={3}
                  value={flyerText}
                  onChange={(e) => setFlyerText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none text-sm resize-none text-white"
                />
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Flyer
                </button>
                <button
                  onClick={() => setShowFlyerModal(false)}
                  className="w-full text-center px-5 py-3 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary/80 transition-colors"
                >
                  Cancel & Close
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center bg-white/5 rounded-xl p-4 border border-border/50">
              <div
                id="printable-flyer"
                className="w-[300px] h-[400px] bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>
                <h2 className="text-xl font-extrabold text-slate-800 mb-8 leading-tight">
                  {flyerText}
                </h2>
                <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-100 mb-6">
                  <QRCodeCanvas
                    value={reviewLink || "https://reviewhub.app"}
                    size={180}
                    level="H"
                    fgColor="#0f172a"
                  />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {primaryLocation?.name ?? "ReviewHub"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
