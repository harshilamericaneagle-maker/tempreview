"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Globe,
  Bell,
  CheckSquare,
  Send,
  Trophy,
  Users,
  Crosshair,
  Blocks,
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/reviews", icon: Star, label: "Inbox" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Action Tracker" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { href: "/dashboard/requests", icon: Send, label: "Automations" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/ai-insights", icon: Lightbulb, label: "AI Insights" },
  { href: "/dashboard/team", icon: Trophy, label: "Team Leaderboard" },
  { href: "/dashboard/competitors", icon: Crosshair, label: "Competitors" },
  { href: "/dashboard/integrations", icon: Blocks, label: "Integrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardSidebar() {
  const { user, logout, activeLocation, availableLocations, setActiveLocation } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [businessSlug, setBusinessSlug] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const res = await fetch("/api/settings/profile");
      const json = (await res.json()) as {
        ok: boolean;
        data?: { primaryLocation?: { slug: string } };
      };
      if (json.ok && json.data?.primaryLocation?.slug) {
        setBusinessSlug(json.data.primaryLocation.slug);
      }
    };
    void load();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-border bg-card/30 backdrop-blur-xl">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="ReviewHub Logo" className="w-9 h-9 object-contain" />
          <span className="text-xl font-bold gradient-text-primary">ReviewHub</span>
        </Link>
      </div>

      {/* Demo Banner */}
      {user?.role === "demo" && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-xs text-amber-400 font-medium">Demo Account</span>
        </div>
      )}

      {/* Location Selector */}
      {availableLocations.length > 0 && (
        <div className="mx-4 mt-5">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5 block">
            Location
          </label>
          <div className="relative">
            <select
              value={activeLocation?.id || ""}
              onChange={(e) => {
                const match = availableLocations.find((l) => l.id === e.target.value);
                if (match) setActiveLocation(match);
              }}
              className="w-full bg-secondary border border-border text-sm text-foreground rounded-xl px-3 py-2 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {availableLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : "group-hover:text-foreground"}`}
              />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Public link */}
      {businessSlug && (
        <div className="px-3 mb-2">
          <Link
            href={`/r/${businessSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all border border-border/50"
          >
            <Globe className="w-3.5 h-3.5" />
            View Public Page
            <ChevronRight className="w-3 h-3 ml-auto" />
          </Link>
        </div>
      )}

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
