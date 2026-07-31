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

  if (!isHydrated || !user) return <p>Loading...</p>;
  return <>{children}</>;
}