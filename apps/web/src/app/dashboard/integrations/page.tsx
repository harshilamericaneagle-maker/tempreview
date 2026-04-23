"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBusinessByOwner, Business } from "@/lib/store";
import { Blocks, CheckCircle2, Webhook, KeyRound, AlertCircle, RefreshCw } from "lucide-react";

const INTEGRATIONS = [
  { id: "pms-opera", name: "Oracle Opera PMS", category: "Enterprise PMS", active: false },
  { id: "pms-cloudbeds", name: "Cloudbeds", category: "Hospitality Cloud", active: true },
  { id: "pms-mews", name: "Mews", category: "Modern PMS", active: false },
  { id: "pms-guesty", name: "Guesty", category: "Short Term Rentals", active: false },
  { id: "pos-toast", name: "Toast POS", category: "Restaurant POS", active: false },
  { id: "pos-square", name: "Square", category: "Retail POS", active: false },
];

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  const refresh = () => {
    if (!user) return;
    const biz = getBusinessByOwner(user.id);
    if (!biz) return;
    setBusiness(biz);
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const handleToggle = (id: string, current: boolean) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, active: !current } : i)));
  };

  const simulateCheckout = () => {
    setSimulating(true);
    setSimMessage(null);
    setTimeout(() => {
      setSimulating(false);
      setSimMessage(
        "Successfully received Webhook: Guest 'John Doe' checked out. Automation trigger queued!",
      );
      setTimeout(() => setSimMessage(null), 5000);
    }, 1200);
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">App Integrations</h1>
          <p className="text-muted-foreground text-sm">
            Connect your Property Management or Point of Sale systems to automate review requests.
          </p>
        </div>
      </div>

      {/* Simulation Card */}
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
              Test the webhook pipeline without leaving the dashboard. Clicking the button below
              will simulate a checkout event payload arriving from your connected PMS.
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
        {integrations.map((integ) => (
          <div
            key={integ.id}
            className="glass-card rounded-2xl p-6 border border-border flex flex-col items-start transition-all hover:bg-white/5"
          >
            <div className="flex w-full items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <Blocks className="w-6 h-6 text-muted-foreground" />
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${integ.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-secondary text-muted-foreground"}`}
              >
                {integ.active ? "Connected" : "Disconnected"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{integ.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{integ.category}</p>

            <div className="mt-auto w-full pt-4 border-t border-border/50 flex">
              {integ.active ? (
                <button
                  onClick={() => handleToggle(integ.id, integ.active)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border border-border bg-secondary hover:bg-secondary/50 transition-colors text-white"
                >
                  Configure Settings
                </button>
              ) : (
                <button
                  onClick={() => handleToggle(integ.id, integ.active)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Connect App
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Don't see your software listed? We also offer an open API and Zapier integration for
          custom connections. Contact support or visit the Developer Portal.
        </p>
      </div>
    </div>
  );
}
