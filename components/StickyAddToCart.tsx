'use client';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export const StickyAddToCart = ({ product }: { product: Product }) => {
 const [isVisible, setIsVisible] = useState(false);
 const { scrollY } = useScroll();
 const { dispatch } = useCart();

 useMotionValueEvent(scrollY, "change", (latest) => {
 setIsVisible(latest > 400);
 });

 return (
 <motion.div
 className="fixed bottom-0 left-0 w-full bg-white border-t border-slate/10 px-4 py-3 z-40 md:hidden shadow-lg"
 initial={{ y: 100 }}
 animate={{ y: isVisible ? 0 : 100 }}
 transition={{ duration: 0.3 }}
 >
 <div className="flex justify-between items-center gap-4">
 <div className="flex flex-col min-w-0">
 <span className="font-display text-base text-black truncate font-bold">{product.name}</span>
  <span className="font-body text-sm text-black/60">৳{Number(product.basePrice).toLocaleString()}</span>
 </div>
 <button
 onClick={() => dispatch({ type: 'ADD_ITEM', payload: { productId: product.id, quantity: 1 } })}
 className="bg-black text-white px-6 py-3 rounded-xl font-body text-sm font-medium hover:bg-black/90 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-black/10"
 >
 <ShoppingBag className="w-3.5 h-3.5" />
 Add to Bag
 </button>
 </div>
 </motion.div>
 );
};
