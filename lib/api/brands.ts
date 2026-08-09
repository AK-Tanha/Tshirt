import { apiFetch } from '../api-client';
import { Brand, CreateBrandPayload } from '../types';

export function getBrands() {
  return apiFetch<Brand[]>('/brands');
}

export function getBrand(id: string) {
  return apiFetch<Brand>(`/brands/${id}`);
}

export function createBrand(payload: CreateBrandPayload) {
  return apiFetch<Brand>('/brands', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBrand(id: string, payload: Partial<CreateBrandPayload>) {
  return apiFetch<Brand>(`/brands/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteBrand(id: string) {
  return apiFetch<Brand>(`/brands/${id}`, { method: 'DELETE' });
}
