"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyBusinessPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/r/${slug}`);
  }, [router, slug]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-muted-foreground">Redirecting to public review page...</p>
    </div>
  );
}
