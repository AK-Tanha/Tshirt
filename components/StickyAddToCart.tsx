'use client';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { Product } from '@/lib/types';

export const StickyAddToCart = ({ product }: { product: Product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 400);
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-bone border-t border-slate p-4 z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-display text-lg text-navy">{product.name}</span>
          <span className="font-mono text-xs text-forest">৳{product.price}</span>
        </div>
        <button className="bg-forest text-bone px-6 py-2 font-body uppercase text-sm tracking-[0.05em]">Add to Cart</button>
      </div>
    </motion.div>
  );
};
