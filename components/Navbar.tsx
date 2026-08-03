"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useAuthStore } from "@/stores/auth-store";

export const Navbar = () => {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { data: categories } = useCategories();
  const { user, isHydrated, logout } = useAuthStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  const cartCount = state.items.length;

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled || mobileOpen
          ? "bg-white/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="px-page max-w-7xl mx-auto h-14 md:h-16 flex justify-between items-center">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-start gap-1.5"
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-[1.5px] w-6 bg-ink rounded-full origin-center"
            animate={mobileOpen ? { rotate: 45, y: 4, x: 1 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-[1.5px] w-4 bg-ink rounded-full"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-[1.5px] w-6 bg-ink rounded-full origin-center"
            animate={mobileOpen ? { rotate: -45, y: -4, x: 1 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-baseline gap-2"
        >
          <span className="font-display text-2xl md:text-[1.7rem] tracking-tight text-ink leading-none font-bold">
            Apan
          </span>
          <span className="hidden sm:inline font-mono text-[9px] tracking-[0.35em] uppercase text-ink/50">
            Apparel
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-10 items-center">
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="font-body text-[13px] text-ink/60 hover:text-ink transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="font-body text-[13px] text-ink/60 hover:text-ink transition-colors"
          >
            Shop All
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isHydrated &&
            (user ? (
              <button
                onClick={logout}
                className="hidden md:inline font-body text-[13px] text-ink/60 hover:text-ink transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline font-body text-[13px] text-ink/60 hover:text-ink transition-colors"
              >
                Login
              </Link>
            ))}
          <Link href="/cart" className="relative group p-1" aria-label="Shopping bag">
            <ShoppingBag className="w-[18px] h-[18px] text-ink group-hover:opacity-60 transition-opacity" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-accent text-accent-fg text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-mono"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-14 bg-paper z-40 overflow-y-auto"
          >
            <div className="px-page py-6 pb-16 flex flex-col gap-1">
              {categories?.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between py-4 border-b border-border"
                  >
                    <span className="font-display text-3xl text-ink leading-none">
                      {cat.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (categories?.length ?? 0) * 0.05 }}
              >
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between py-4 border-b border-border"
                >
                  <span className="font-display text-3xl text-ink leading-none">
                    Shop All
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>

              <div className="mt-8 flex flex-col gap-3">
                {isHydrated &&
                  (user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full border border-border rounded-full py-3 font-body text-sm font-medium text-ink"
                    >
                      Log out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full bg-accent text-accent-fg rounded-full py-3 font-body text-sm font-medium text-center"
                    >
                      Sign in
                    </Link>
                  ))}
                <p className="text-center font-mono text-[9px] tracking-[0.3em] uppercase text-ink/40">
                  Apan Apparel — Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
