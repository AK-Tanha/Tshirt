"use client";
import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useSite } from "@/hooks/use-site";
import { useCategories } from "@/hooks/use-categories";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const { data: site } = useSite();
    const { data: categories } = useCategories();
      const pathname = usePathname();
    
  
  return (
    <footer className="bg-ink text-white mt-20 md:mt-28">
      <div className="px-page max-w-7xl mx-auto py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-14">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="block mb-4">
              <Logo
                variant="white"
                alt={site?.siteName ?? "Apan"}
                src={site?.logoUrl ?? undefined}
                className="h-10 md:h-12 w-auto"
              />
            </Link>
            <p className="font-body text-sm text-white/50 max-w-sm leading-relaxed">
              Crafting the future of apparel through high-quality materials and
              timeless design. Based in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
              Shop
            </h4>
            <ul className="space-y-3 font-body text-sm">
              {categories?.slice(0, 3).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={cn(
                      "font-body text-[13px] transition-colors",
                      pathname.startsWith("/products") &&
                        new URLSearchParams(
                          typeof window !== "undefined"
                            ? window.location.search
                            : "",
                        ).get("category") === cat.slug
                        ? "text-white font-medium"
                        : "text-white/60 hover:text-white",
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
              Connect
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
              Help
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/cart"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  My Bag
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] text-white/30 tracking-wider">
            © 2026 {(site?.siteName ?? "APAN APPAREL").toUpperCase()}
          </p>
          <div className="flex gap-6 font-mono text-[9px] text-white/30 tracking-wider">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
