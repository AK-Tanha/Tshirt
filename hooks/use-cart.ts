import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/lib/api/cart';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}