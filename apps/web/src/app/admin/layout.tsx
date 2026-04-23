"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/tenants", icon: Building2, label: "Tenants" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/reviews", icon: Star, label: "All Reviews" },
];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-border bg-card/30 backdrop-blur-xl">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold gradient-text-primary leading-none">ReviewHub</div>
            <div className="text-xs text-red-400 font-medium">Admin Panel</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-red-400" : ""}`} />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-red-400" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-red-400">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "super_admin") router.push("/app");
  }, [user, loading, router]);

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
