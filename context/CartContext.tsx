'use client';
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useRef,
} from 'react';

export interface CartLineItem {
  variantId: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartLineItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartLineItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'HYDRATE'; payload: CartLineItem[] }
  | { type: 'CLEAR_CART' };

const STORAGE_KEY = 'apan_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload };
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.variantId === action.payload.variantId,
      );
      if (existing) {
        const quantity = Math.min(
          existing.quantity + action.payload.quantity,
          action.payload.stock,
        );
        return {
          ...state,
          items: state.items.map((item) =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: Math.min(action.payload.quantity, action.payload.stock) },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.variantId !== action.payload),
      };
    case 'SET_QUANTITY':
      return {
        items: state.items.map((item) =>
          item.variantId === action.payload.variantId
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(action.payload.quantity, item.stock),
                ),
              }
            : item,
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartLineItem[];
        if (Array.isArray(items)) dispatch({ type: 'HYDRATE', payload: items });
      }
    } catch {
      // ignore corrupted storage
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage unavailable — ignore
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
