"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, user, pathname, router]);

  if (!isHydrated || !user) {
    return (
      <main className="px-page max-w-xl mx-auto py-24 text-center">
        <p className="text-muted">Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}