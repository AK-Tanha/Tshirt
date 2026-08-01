import { apiFetch } from '../api-client';
import { Product, PaginatedProducts, ProductQueryParams, CreateProductPayload } from '@/lib/types';

export function getProducts(params: ProductQueryParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  const queryString = query.toString();
  return apiFetch<PaginatedProducts>(`/products${queryString ? `?${queryString}` : ''}`);
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(payload: CreateProductPayload) {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: string, payload: Partial<CreateProductPayload>) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`, { method: 'DELETE' });
}
