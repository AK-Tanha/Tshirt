import { useMutation } from '@tanstack/react-query';
import { register, login, updateProfile } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/lib/api/auth';
import { RegisterPayload, LoginPayload, User } from '@/lib/types';

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await register(payload);
      const user = await getMe(); // token isn't attached to headers until stored, so fetch user after
      setAuth(user, data.access_token);
      return { user, access_token: data.access_token };
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await login(payload);
      // temporarily set token so apiFetch can use it for the /auth/me call
      localStorage.setItem('access_token', data.access_token);
      const user = await getMe();
      setAuth(user, data.access_token);
      return { user, access_token: data.access_token };
    },
  });
}

export function useUpdateProfile() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: Partial<Pick<User, 'name' | 'address' | 'image'>>) =>
      updateProfile(payload),
    onSuccess: (user) => {
      const token = localStorage.getItem('access_token');
      if (token) setAuth(user, token);
    },
  });
}