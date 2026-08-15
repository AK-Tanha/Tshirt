"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import { ShoppingBag, ArrowRight, User, Package } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useSite } from "@/hooks/use-site";
import { useAuthStore } from "@/stores/auth-store";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { data: categories } = useCategories();
  const { data: site } = useSite();
  const { user, logout } = useAuthStore();
  const setCartOpen = useCartDrawerStore((s) => s.setOpen);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close the menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const cartCount = state.items.length;

  const closeMenuAnd = (fn?: () => void) => {
    setMobileOpen(false);
    fn?.();
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-white/90 backdrop-blur-xl border-b border-border md:bg-transparent md:backdrop-blur-none md:border-transparent ${
          isScrolled || mobileOpen
            ? "md:bg-white/85 md:backdrop-blur-xl md:border-border"
            : ""
        }`}
      >
        <nav className="px-page max-w-7xl mx-auto h-14 md:h-16 flex justify-between items-center">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-start gap-1.5"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
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
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center"
            aria-label={`${site?.siteName ?? "Apan Apparel"} home`}
          >
            <Logo priority src={site?.logoUrl ?? undefined} className="h-8 md:h-9 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-10 items-center">
            {categories?.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={cn(
                  "font-body text-[13px] transition-colors",
                  pathname.startsWith("/products") &&
                    new URLSearchParams(
                      typeof window !== "undefined"
                        ? window.location.search
                        : "",
                    ).get("category") === cat.slug
                    ? "text-ink font-medium"
                    : "text-ink/60 hover:text-ink",
                )}
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
            {user ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="hidden md:inline font-body text-[13px] text-ink/60 hover:text-ink transition-colors"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => {
                setMobileOpen(false);
                setCartOpen(true);
              }}
              className="relative group p-1"
              aria-label="Open shopping bag"
            >
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
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu (sibling of header so backdrop-filter on the
          header can't trap the fixed menu inside it) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-14 bg-paper z-50 overflow-y-auto"
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-page py-6 pb-16 flex flex-col">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center justify-between py-4 border-b border-border",
                  pathname === "/" && "text-accent",
                )}
              >
                <span className="font-display text-3xl text-ink leading-none">
                  Home
                </span>
                <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all" />
              </Link>
              {categories?.slice(0, 3).map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between py-4 border-b border-border",
                      pathname.startsWith("/products") &&
                        new URLSearchParams(
                          typeof window !== "undefined"
                            ? window.location.search
                            : "",
                        ).get("category") === cat.slug &&
                        "text-accent",
                    )}
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
                transition={{ delay: 0.2 + (categories?.length ?? 0) * 0.04 }}
              >
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center justify-between py-4 border-b border-border",
                    pathname === "/products" && "text-accent",
                  )}
                >
                  <span className="font-display text-3xl text-ink leading-none">
                    Shop All
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>

              <div className="mt-8 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 border border-border rounded-full py-3 font-body text-sm font-medium text-ink"
                    >
                      <User className="w-4 h-4" /> My profile
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 border border-border rounded-full py-3 font-body text-sm font-medium text-ink"
                    >
                      <Package className="w-4 h-4" /> My orders
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="w-full text-center border border-border rounded-full py-3 font-body text-sm font-medium text-ink"
                      >
                        Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => closeMenuAnd(logout)}
                      className="w-full border border-border rounded-full py-3 font-body text-sm font-medium text-ink"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full bg-accent text-accent-fg rounded-full py-3 font-body text-sm font-medium text-center"
                  >
                    Sign in
                  </Link>
                )}
                <p className="text-center font-mono text-[9px] tracking-[0.3em] uppercase text-ink/40">
                  Apan Apparel — Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
