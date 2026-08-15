"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function RequireRole({
  role,
  children,
}: {
  role: 'USER' | 'ADMIN';
  children: React.ReactNode;
}) {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      router.push('/'); // logged in, but not an admin — bounce to storefront
    }
  }, [isHydrated, user, role, router]);

  if (!isHydrated || !user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <span className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Checking access...</p>
      </div>
    );
  if (role === 'ADMIN' && user.role !== 'ADMIN') return null; // brief flash before redirect fires

  return <>{children}</>;
}