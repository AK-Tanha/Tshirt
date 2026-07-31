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

  if (!isHydrated || !user) return <p>Loading...</p>;
  if (role === 'ADMIN' && user.role !== 'ADMIN') return null; // brief flash before redirect fires

  return <>{children}</>;
}