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

  const { scrollYProgress } = useScroll();

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-bone/80 backdrop-blur-md py-1 border-b border-slate/10' : 'bg-transparent py-2'
      }`}
    >
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-forest origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="group flex flex-col">
          <span className="font-display text-3xl tracking-tighter text-navy leading-none">APAN</span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-forest opacity-0 group-hover:opacity-100 transition-opacity">APPAREL</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/products" className="font-body text-xs uppercase tracking-widest text-navy hover:text-forest transition-colors">Archive</Link>
          <Link href="/cart" className="relative group">
            <span className="font-body text-xs uppercase tracking-widest text-navy group-hover:text-forest transition-colors">Bag</span>
            <motion.span 
              key={state.items.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1.5 -right-3.5 bg-forest text-bone text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono"
            >
              {state.items.length}
            </motion.span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};
