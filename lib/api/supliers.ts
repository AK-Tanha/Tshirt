import { apiFetch } from '../api-client';
import { Product, PaginatedProducts, ProductQueryParams } from '@/lib/types';

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