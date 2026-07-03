'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

export const Navbar = () => {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 bg-bone/95 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="font-display text-2xl tracking-[0.02em] text-navy">APAN</Link>
        <div className="flex gap-6 items-center">
          <Link href="/products" className="font-body text-sm uppercase tracking-[0.05em] text-navy">Shop</Link>
          <Link href="/cart" className="relative font-body text-sm uppercase tracking-[0.05em] text-navy">
            Cart
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-forest text-bone text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {state.items.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};
