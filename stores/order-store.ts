import { create } from 'zustand';
import { Order } from '@/lib/types';

interface OrderState {
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
  clearLastOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  lastOrder: null,
  setLastOrder: (lastOrder) => set({ lastOrder }),
  clearLastOrder: () => set({ lastOrder: null }),
}));
