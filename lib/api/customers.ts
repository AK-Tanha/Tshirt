import { apiFetch } from '../api-client';
import { Customer } from '@/lib/types';

export function getCustomers() {
  return apiFetch<Customer[]>('/customers');
}

export function getCustomer(id: string) {
  return apiFetch<Customer>(`/customers/${id}`);
}
