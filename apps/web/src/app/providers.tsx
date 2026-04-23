"use client";

import { AuthProvider } from "@/lib/auth";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ImpersonationBanner />
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
