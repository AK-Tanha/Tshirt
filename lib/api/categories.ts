import { apiFetch } from '../api-client';
import { Category } from '../types';

export interface CategoryPayload {
  name: string;
  slug: string;
}

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}

export function getCategory(id: string) {
  return apiFetch<Category>(`/categories/${id}`);
}

export function createCategory(payload: CategoryPayload) {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: string) {
  return apiFetch<Category>(`/categories/${id}`, { method: 'DELETE' });
}
