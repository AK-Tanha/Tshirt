import { apiFetch } from '../api-client';
import {
  StockMovement,
  PaginatedStockMovements,
  StockMovementQueryParams,
  CreateStockMovementPayload,
} from '@/lib/types';

export function getStockMovements(params: StockMovementQueryParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });

  const queryString = query.toString();
  return apiFetch<PaginatedStockMovements>(
    `/stock-movements${queryString ? `?${queryString}` : ''}`,
  );
}

export function adjustStock(payload: CreateStockMovementPayload) {
  return apiFetch<StockMovement>('/stock-movements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}