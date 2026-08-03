import { apiFetch } from '../api-client';
import { UserRecord } from '../types';

export function getUsers() {
  return apiFetch<UserRecord[]>('/users');
}

export function getUsersByRole(role: 'USER' | 'ADMIN') {
  return apiFetch<UserRecord[]>(`/users?role=${role}`);
}

export function getUser(id: string) {
  return apiFetch<UserRecord>(`/users/${id}`);
}

export function updateUserRole(id: string, role: 'USER' | 'ADMIN') {
  return apiFetch<UserRecord>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}