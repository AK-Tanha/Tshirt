import { apiFetch } from '../api-client';
import { Supplier, CreateSupplierPayload } from '@/lib/types';

export function getSuppliers() {
  return apiFetch<Supplier[]>('/suppliers');
}

export function getSupplier(id: string) {
  return apiFetch<Supplier>(`/suppliers/${id}`);
}

export function createSupplier(payload: CreateSupplierPayload) {
  return apiFetch<Supplier>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateSupplier(id: string, payload: Partial<CreateSupplierPayload>) {
  return apiFetch<Supplier>(`/suppliers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteSupplier(id: string) {
  return apiFetch<Supplier>(`/suppliers/${id}`, { method: 'DELETE' });
}
