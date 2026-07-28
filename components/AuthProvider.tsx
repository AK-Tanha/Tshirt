"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/lib/api/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setHydrated(true);
      return;
    }

    getMe()
      .then((user) => setAuth(user, token))
      .catch(() => {
        // token expired or invalid — clear it
        localStorage.removeItem('access_token');
      })
      .finally(() => setHydrated(true));
  }, []);

  return <>{children}</>;
}