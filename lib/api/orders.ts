import { apiFetch } from '../api-client';
import { Order, CreateOrderPayload, OrderStatus } from '@/lib/types';

export function getOrders() {
  return apiFetch<Order[]>('/orders');
}

export function getOrder(id: string) {
  return apiFetch<Order>(`/orders/${id}`);
}

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAdminOrders() {
  return apiFetch<Order[]>('/orders/admin/all');
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
