import { apiFetch } from '../api-client';
import {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  User,
} from '@/lib/types';

export function register(payload: RegisterPayload) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiFetch<User>('/auth/me');
}

export function updateProfile(payload: Partial<Pick<User, 'name' | 'address' | 'image'>>) {
  return apiFetch<User>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}