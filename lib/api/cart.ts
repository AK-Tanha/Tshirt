import { apiFetch } from '../api-client';
import { Cart, CartItem } from '@/lib/types';

export function getCart() {
  return apiFetch<Cart>('/cart');
}

export function addToCart(payload: { productId: string; variantId: string; quantity: number }) {
  return apiFetch<CartItem>('/cart/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch<CartItem>(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string) {
  return apiFetch<void>(`/cart/items/${itemId}`, { method: 'DELETE' });
}