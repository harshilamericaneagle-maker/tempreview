"use client";

import { useEffect, useMemo, useState } from "react";
import { Blocks, CheckCircle2, Webhook, KeyRound, AlertCircle, RefreshCw } from "lucide-react";

type IntegrationItem = {
  id: string;
  provider: "google" | "yelp" | "facebook";
  status: "connected" | "error" | "disconnected";
  location: { id: string; name: string };
};
type Location = { id: string; name: string; slug: string };

export default function IntegrationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  const refresh = async () => {
    const [locRes, intRes] = await Promise.all([
      fetch("/api/locations"),
      fetch("/api/integrations"),
    ]);
    const locJson = (await locRes.json()) as { ok: boolean; data: Location[] };
    const intJson = (await intRes.json()) as { ok: boolean; data: IntegrationItem[] };
    if (locJson.ok) setLocations(locJson.data);
    if (intJson.ok) setIntegrations(intJson.data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const providerCards = useMemo(
    () =>
      [
        { id: "google", name: "Google Business", category: "Reviews + Reply Sync" },
        { id: "yelp", name: "Yelp", category: "Review Ingestion" },
        { id: "facebook", name: "Facebook", category: "Recommendations Sync" },
      ].map((provider) => {
        const existing = integrations.find((i) => i.provider === provider.id);
        return { ...provider, existing };
      }),
    [integrations],
  );

  const handleToggle = async (provider: "google" | "yelp" | "facebook", connected: boolean) => {
    if (connected) {
      const existing = integrations.find((i) => i.provider === provider);
      if (!existing) return;
      await fetch(`/api/integrations/${existing.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "disconnected" }),
      });
    } else {
      const location = locations[0];
      if (!location) return;
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: location.id, provider, status: "connected" }),
      });
    }
    await refresh();
  };

  const simulateCheckout = () => {
    setSimulating(true);
    setSimMessage(null);
    setTimeout(() => {
      setSimulating(false);
      setSimMessage("Webhook accepted: checkout event queued for campaign delivery.");
      setTimeout(() => setSimMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">App Integrations</h1>
          <p className="text-muted-foreground text-sm">
            Connect your sources to sync and respond to real reviews.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-primary/30 mb-8 bg-primary/5">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Webhook className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Developer Sandbox: Simulate Checkout Payload
            </h3>
            <p className="text-muted-foreground text-sm max-w-2xl mb-4">
              Validate webhook flow from the dashboard. This simulates a checkout trigger for
              campaign automation.
            </p>

            {simMessage ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-sm font-medium inline-flex">
                <CheckCircle2 className="w-5 h-5" />
                {simMessage}
              </div>
            ) : (
              <button
                onClick={simulateCheckout}
                disabled={simulating}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 min-w-[200px] justify-center"
              >
                {simulating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Simulate 'Guest Checkout'"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {providerCards.map((integ) => {
          const connected = integ.existing?.status === "connected";
          return (
            <div
              key={integ.id}
              className="glass-card rounded-2xl p-6 border border-border flex flex-col items-start transition-all hover:bg-white/5"
            >
              <div className="flex w-full items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-border">
                  <Blocks className="w-6 h-6 text-muted-foreground" />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    connected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{integ.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{integ.category}</p>
              {integ.existing?.location?.name && (
                <p className="text-xs text-muted-foreground mb-4">
                  Location: {integ.existing.location.name}
                </p>
              )}

              <div className="mt-auto w-full pt-4 border-t border-border/50 flex">
                <button
                  onClick={() =>
                    void handleToggle(integ.id as "google" | "yelp" | "facebook", connected)
                  }
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                    connected
                      ? "border border-border bg-secondary hover:bg-secondary/50 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {!connected && <KeyRound className="w-4 h-4" />}
                  {connected ? "Disconnect" : "Connect App"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Need a custom source? Use the API/webhook ingestion path and create an integration entry
          per location.
        </p>
      </div>
    </div>
  );
}
