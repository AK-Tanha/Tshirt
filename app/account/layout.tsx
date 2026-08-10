"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/auth-store";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <main className="px-page max-w-xl mx-auto py-24 text-center">
        <p className="text-muted">Loading account...</p>
      </main>
    );
  }

  return <ToastProvider>{children}</ToastProvider>;
}
