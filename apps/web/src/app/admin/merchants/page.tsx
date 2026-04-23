"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyAdminMerchantsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/tenants");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-muted-foreground">Redirecting to tenant admin...</p>
    </div>
  );
}
