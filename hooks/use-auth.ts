import { useMutation } from '@tanstack/react-query';
import { register, login } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/lib/api/auth';
import { RegisterPayload, LoginPayload } from '@/lib/types';

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: async (data) => {
      const user = await getMe(); // token isn't attached to headers until stored, so fetch user after
      setAuth(user, data.access_token);
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      // temporarily set token so apiFetch can use it for the /auth/me call
      localStorage.setItem('access_token', data.access_token);
      const user = await getMe();
      setAuth(user, data.access_token);
    },
  });
}