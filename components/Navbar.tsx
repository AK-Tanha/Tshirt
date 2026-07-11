'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { products } from '@/lib/data';

const categories = [
  { slug: 'polo', label: 'Polos', items: products.filter(p => p.category === 'polo') },
  { slug: 'tshirt', label: 'Tees', items: products.filter(p => p.category === 'tshirt') },
];

export const Navbar = () => {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const { scrollYProgress } = useScroll();

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md py-1 border-b border-border' : 'bg-transparent py-2'
      }`}
    >
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-black origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="group" onClick={() => setMobileOpen(false)}>
          <span className="font-display text-2xl md:text-3xl tracking-tight text-black font-bold leading-none">APAN</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="flex items-center gap-1 font-body text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
              Categories <ChevronDown className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-border rounded-xl shadow-xl p-6 flex gap-8 min-w-[500px]"
                >
                  {categories.map(cat => (
                    <div key={cat.slug} className="flex-1">
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="font-body text-sm font-medium text-black hover:text-muted transition-colors block mb-4"
                      >
                        {cat.label}
                      </Link>
                      <div className="flex flex-col gap-3">
                        {cat.items.map(item => (
                          <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-stone transition-colors"
                          >
                            <div className="relative w-10 h-12 rounded-md overflow-hidden bg-stone shrink-0">
                              <Image src={item.heroImage} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-body text-xs text-black group-hover:text-muted transition-colors block truncate">{item.name}</span>
                              <span className="font-body text-[11px] text-muted">৳{item.price}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/products" className="font-body text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">Shop</Link>
          <Link href="/cart" className="relative group">
            <ShoppingBag className="w-4 h-4 text-black group-hover:text-muted transition-colors" />
            <motion.span 
              key={state.items.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-3 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono"
            >
              {state.items.length}
            </motion.span>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-6 h-5 flex flex-col justify-between items-center"
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-[1.5px] w-full bg-black origin-center"
            animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-[1.5px] w-full bg-black"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-[1.5px] w-full bg-black origin-center"
            animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-b border-border"
          >
            <div className="px-6 pb-8 pt-4 flex flex-col gap-2">
              {categories.map(cat => (
                <div key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-base font-medium text-black py-3 block border-b border-border"
                  >
                    {cat.label}
                  </Link>
                </div>
              ))}
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="font-body text-base font-medium text-black py-3 block border-b border-border"
              >
                Shop All
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="font-body text-base font-medium text-black py-3 block flex items-center gap-2 border-b border-border"
              >
                <ShoppingBag className="w-4 h-4" />
                Bag
                {state.items.length > 0 && (
                  <span className="bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {state.items.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
