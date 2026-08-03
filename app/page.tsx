"use client";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { MotionSection } from "@/components/MotionSection";
import { Marquee } from "@/components/Marquee";
import { motion } from "motion/react";
import { useCategories } from "../hooks/use-categories";
import { Truck, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";

const perks = [
  { icon: Truck, label: "Free delivery in Dhaka" },
  { icon: RotateCcw, label: "7-day easy exchange" },
  { icon: ShieldCheck, label: "Quality guaranteed" },
];

export default function Home() {
  const { data, isLoading, error } = useProducts({ page: 1, limit: 20 });
  const products = data?.data ?? [];
  const { data: categories } = useCategories();

  const featured = products.slice(0, 4);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="font-body text-muted animate-pulse">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="font-body text-muted">Error: {error.message}</p>
      </div>
    );

  return (
    <main className="pb-20 md:pb-28">
      {/* Hero */}
      <section className="relative min-h-[86svh] md:h-screen w-full overflow-hidden flex items-end md:items-center">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://picsum.photos/seed/apparel/1080/1920')] md:bg-[url('https://picsum.photos/seed/apparel/1920/1080')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20 md:bg-gradient-to-r md:from-ink/85 md:via-ink/50 md:to-transparent" />

        <div className="relative z-10 px-page max-w-7xl mx-auto w-full pb-16 md:pb-0">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="font-mono text-white/50 uppercase tracking-[0.35em] text-[10px] mb-5 block">
              Collection 2026
            </span>
            <h1 className="font-display text-white leading-[0.95] mb-7 tracking-tight font-bold text-6xl sm:text-7xl md:text-8xl">
              Wear the
              <br />
              <em className="font-light italic">Future</em>,{" "}
              <span className="font-light">always.</span>
            </h1>
            <p className="font-body text-white/70 text-sm md:text-base leading-relaxed max-w-md mb-9">
              Premium polos and tees, cut in Dhaka and built to outlast
              the season. Clean fits, honest fabrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="bg-white text-ink px-8 py-4 font-body text-sm font-semibold hover:bg-white/90 transition-all duration-300 rounded-full text-center flex items-center justify-center gap-2"
              >
                Shop the collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=polo"
                className="border border-white/25 text-white px-8 py-4 font-body text-sm font-medium hover:bg-white hover:text-ink transition-all duration-300 rounded-full text-center"
              >
                Browse polos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-ink text-white">
        <div className="px-page max-w-7xl mx-auto py-5 md:py-6 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between items-center">
          {perks.map((perk, i) => (
            <div key={perk.label} className="flex items-center gap-3">
              <perk.icon className="w-4 h-4 text-tan" />
              <span className="font-body text-[11px] md:text-xs tracking-widest uppercase text-white/70">
                {perk.label}
              </span>
              {i < perks.length - 1 && (
                <span className="hidden sm:block w-px h-4 bg-white/15 ml-8" />
              )}
            </div>
          ))}
        </div>
      </section>

      <Marquee text="New Arrivals • Limited Edition • Premium Quality • Apan Apparel •" />

      {/* Featured Grid */}
      <section className="px-page max-w-7xl mx-auto pt-14 md:pt-24">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <MotionSection>
            <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
              Curation
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-ink tracking-tight font-bold leading-none">
              Featured <em className="font-light italic">pieces</em>
            </h2>
          </MotionSection>
          <Link
            href="/products"
            className="font-body text-[13px] text-muted hover:text-ink transition-colors flex items-center gap-1.5 shrink-0"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Category Sections */}
      {categories?.map((cat) => {
        const categoryProducts = products
          .filter((p) => p.category.id === cat.id)
          .slice(0, 4);
        if (categoryProducts.length === 0) return null;
        return (
          <section
            key={cat.id}
            className="px-page max-w-7xl mx-auto pt-14 md:pt-24"
          >
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <MotionSection>
                <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
                  Shop by category
                </span>
                <h2 className="font-display text-4xl md:text-6xl text-ink tracking-tight font-bold leading-none">
                  {cat.name}
                </h2>
              </MotionSection>
              <Link
                href={`/products?category=${cat.slug}`}
                className="font-body text-[13px] text-muted hover:text-ink transition-colors flex items-center gap-1.5 shrink-0"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
              {categoryProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Editorial band */}
      <section className="px-page max-w-7xl mx-auto pt-20 md:pt-32">
        <MotionSection className="border-t border-border pt-10 md:pt-16 flex flex-col md:flex-row justify-between gap-8 md:items-end">
          <h2 className="font-display text-3xl md:text-5xl text-ink tracking-tight font-bold leading-tight max-w-lg">
            Made slowly. Worn <em className="font-light italic">endlessly.</em>
          </h2>
          <p className="font-body text-sm md:text-base text-muted leading-relaxed max-w-sm">
            Every Apan piece is produced in small batches with breathable
            cottons and reinforced stitching — designed in Bangladesh for the
            way you actually live.
          </p>
        </MotionSection>
      </section>
    </main>
  );
}
