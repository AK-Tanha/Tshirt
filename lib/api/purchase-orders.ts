import { apiFetch } from '../api-client';
import {
  PurchaseOrder,
  CreatePurchaseOrderPayload,
  PurchaseOrderStatus,
} from '@/lib/types';

export function getPurchaseOrders() {
  return apiFetch<PurchaseOrder[]>('/purchase-orders');
}

export function getPurchaseOrder(id: string) {
  return apiFetch<PurchaseOrder>(`/purchase-orders/${id}`);
}

export function createPurchaseOrder(payload: CreatePurchaseOrderPayload) {
  return apiFetch<PurchaseOrder>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus) {
  return apiFetch<PurchaseOrder>(`/purchase-orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
