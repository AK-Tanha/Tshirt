import { apiFetch } from '../api-client';
import {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from '@/lib/types';

export function getCustomers() {
  return apiFetch<Customer[]>('/customers');
}

export function getCustomer(id: string) {
  return apiFetch<Customer>(`/customers/${id}`);
}

export function createCustomer(payload: CreateCustomerPayload) {
  return apiFetch<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(id: string, payload: UpdateCustomerPayload) {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCustomer(id: string) {
  return apiFetch<Customer>(`/customers/${id}`, { method: 'DELETE' });
}