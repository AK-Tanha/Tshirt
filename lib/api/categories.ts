import { apiFetch } from '../api-client';
import { Category } from '../types';``

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}

export function getCategory(id: string) {
  return apiFetch<Category>(`/categories/${id}`);
}