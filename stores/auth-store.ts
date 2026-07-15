// stores/auth-store.ts — Zustand, client-only state
import { create } from 'zustand';

interface AuthState {
  user: { userId: string; phone: string; role: string } | null;
  token: string | null;
  setAuth: (user: AuthState['user'], token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('access_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));