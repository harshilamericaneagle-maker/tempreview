import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <div className="flex items-center gap-2 pl-4 border-l border-border/40">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium">Demo User</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-muted">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
