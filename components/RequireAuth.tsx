"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) router.push('/login');
  }, [isHydrated, user, router]);

  if (!isHydrated || !user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Checking session...</p>
      </div>
    );
  return <>{children}</>;
}