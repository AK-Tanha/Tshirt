import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrder,
  createOrder,
  createGuestOrder,
  lookupOrder,
  getAdminOrders,
  getAdminOrder,
  createAdminOrder,
  updateAdminOrder,
  deleteAdminOrder,
  updateOrderStatus,
} from '@/lib/api/orders';
import {
  CreateOrderPayload,
  CreateGuestOrderPayload,
  AdminCreateOrderPayload,
  AdminUpdateOrderPayload,
  OrderStatus,
} from '@/lib/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: !!id && enabled,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCreateGuestOrder() {
  return useMutation({
    mutationFn: (payload: CreateGuestOrderPayload) => createGuestOrder(payload),
  });
}

export function useLookupOrder() {
  return useMutation({
    mutationFn: ({ id, phone }: { id: string; phone: string }) =>
      lookupOrder(id, phone),
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAdminOrders,
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => getAdminOrder(id),
    enabled: !!id,
  });
}

export function useUpdateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUpdateOrderPayload }) =>
      updateAdminOrder(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateAdminOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminCreateOrderPayload) => createAdminOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
