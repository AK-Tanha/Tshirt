import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStockMovements,
  adjustStock,
} from '@/lib/api/stock-movements';
import {
  StockMovementQueryParams,
  CreateStockMovementPayload,
} from '@/lib/types';

export function useStockMovements(params: StockMovementQueryParams = {}) {
  return useQuery({
    queryKey: ['stock-movements', params],
    queryFn: () => getStockMovements(params),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStockMovementPayload) => adjustStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}