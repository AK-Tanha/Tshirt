"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { MotionSection } from "@/components/MotionSection";
import { Marquee } from "@/components/Marquee";
import { motion, AnimatePresence } from "motion/react";
import { useCategories } from "../hooks/use-categories";
import { useCollections } from "../hooks/use-collections";
import { cn } from "@/lib/utils";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Search,
} from "lucide-react";

const perks = [
  { icon: Truck, label: "Free delivery in Dhaka" },
  { icon: RotateCcw, label: "7-day easy exchange" },
  { icon: ShieldCheck, label: "Quality guaranteed" },
];

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  emWord?: string;
  sub: string;
  image: string;
  mobileImage?: string | null;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

function renderHeadline(text: string, emWord?: string) {
  if (!emWord || !text.includes(emWord)) return text;
  const [before, after] = text.split(emWord);
  return (
    <>
      {before}
      <em className="font-light italic">{emWord}</em>
      {after}
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const { data, isLoading, error } = useProducts({ page: 1, limit: 20 });
  const products = data?.data ?? [];
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  const activeCollections = (collections ?? []).filter((c) => c.isActive);

  const slides: HeroSlide[] =
    activeCollections.length > 0
      ? activeCollections.map((c) => ({
          id: c.id,
          eyebrow: "Featured Collection",
          headline: c.name,
          sub:
            c.description ??
            "Part of the Apan collection — clean fits, honest fabrics.",
          image:
            c.image ??
            `https://picsum.photos/seed/${c.slug}/1080/1920`,
          mobileImage: c.mobileImage ?? null,
          ctaPrimary: {
            label: "Shop collection",
            href: `/products?collection=${c.slug}`,
          },
          ctaSecondary: { label: "Browse all", href: "/products" },
        }))
      : [
          {
            id: "default",
            eyebrow: "Collection 2026",
            headline: "Wear the Future, always.",
            emWord: "Future",
            sub: "Premium polos and tees, cut in Dhaka and built to outlast the season. Clean fits, honest fabrics.",
            image:
              "https://picsum.photos/seed/apparel/1080/1920",
            ctaPrimary: {
              label: "Shop the collection",
              href: "/products",
            },
            ctaSecondary: {
              label: "Browse polos",
              href: "/products?category=polo",
            },
          },
        ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");

  const prevSlide = () =>
    setSlideIndex((i) => (i - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setSlideIndex((i) => (i + 1) % slides.length);

  // clamp for rendering so a shrinking slide set can never leave the index out of range
  const current = slideIndex % slides.length;

  // auto-advance the carousel, pausing while hovered
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(
      () => setSlideIndex((i) => (i + 1) % slides.length),
      6000,
    );
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

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
      <section
        className="relative min-h-[86svh] md:h-screen w-full overflow-hidden flex items-end md:items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Mobile portrait background */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`${current}-mobile`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 md:hidden bg-[length:auto_100%] bg-center"
            style={{
              backgroundImage: `url('${slides[current].mobileImage ?? slides[current].image}')`,
            }}
          />
        </AnimatePresence>

        {/* Desktop background */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`${current}-desktop`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 hidden md:block bg-cover bg-center"
            style={{
              backgroundImage: `url('${slides[current].image}')`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20 md:bg-gradient-to-r md:from-ink/85 md:via-ink/50 md:to-transparent" />

        {/* Prev / next arrows */}
        {slides.length > 1 && (
          <div className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/25 text-white/80 hover:bg-white hover:text-ink transition-colors flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/25 text-white/80 hover:bg-white hover:text-ink transition-colors flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative z-10 px-page max-w-7xl mx-auto w-full pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="font-mono text-white/50 uppercase tracking-[0.35em] text-[10px] mb-5 block">
                {slides[current].eyebrow}
              </span>
              <h1 className="font-display text-white leading-[0.95] mb-6 tracking-tight font-bold text-5xl sm:text-7xl md:text-8xl">
                {renderHeadline(
                  slides[current].headline,
                  slides[current].emWord,
                )}
              </h1>
              <p className="font-body text-white/70 text-sm md:text-base leading-relaxed max-w-md mb-8">
                {slides[current].sub}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={slides[current].ctaPrimary.href}
                  className="bg-white text-ink px-8 py-4 font-body text-sm font-semibold hover:bg-white/90 transition-all duration-300 rounded-full text-center flex items-center justify-center gap-2"
                >
                  {slides[current].ctaPrimary.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={slides[current].ctaSecondary.href}
                  className="border border-white/30 bg-white/15 backdrop-blur-md text-white px-8 py-4 font-body text-sm font-medium hover:bg-white hover:text-ink transition-all duration-300 rounded-full text-center"
                >
                  {slides[current].ctaSecondary.label}
                </Link>
              </div>

              {/* Search */}
              <form
                onSubmit={handleHeroSearch}
                className="mt-7 flex items-center gap-2 bg-white/95 backdrop-blur rounded-full p-1.5 pl-4 shadow-lg max-w-md"
              >
                <Search className="w-4 h-4 text-ink/50 shrink-0" />
                <input
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Search polos, tees, sizes..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-ink text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Quick category links — mobile only, desktop already has them in the navbar */}
              {categories && categories.length > 0 && (
                <div className="mt-5 lg:hidden flex flex-wrap items-center gap-2">
                  {categories.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="border border-white/20 text-white/80 hover:bg-white hover:text-ink transition-colors rounded-full px-3.5 py-1.5 font-body text-xs font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Slide indicators */}
              {slides.length > 1 && (
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                          "h-1 rounded-full transition-all duration-300",
                          i === current
                            ? "w-8 bg-white"
                            : "w-3 bg-white/35 hover:bg-white/60",
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">
                    {String(current + 1).padStart(2, "0")} /{" "}
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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

      {/* Collection sections (lifterx-style: heading + banner + product cards row) */}
      {activeCollections.map((collection) => {
        const collectionProducts = (collection.products ?? []).filter(
          (p) => p.isActive,
        );
        return (
          <section
            key={collection.id}
            className="px-page max-w-7xl mx-auto pt-14 md:pt-24"
          >
            <div className="flex justify-between items-end mb-8 md:mb-10">
              <MotionSection>
                <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
                  Collection
                </span>
                <h2 className="font-display text-4xl md:text-6xl text-ink tracking-tight font-bold leading-none">
                  {collection.name}
                </h2>
              </MotionSection>
              <Link
                href={`/products?collection=${collection.slug}`}
                className="font-body text-[13px] text-muted hover:text-ink transition-colors flex items-center gap-1.5 shrink-0"
              >
                Shop collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/products?collection=${collection.slug}`}
                className="group relative block aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl bg-stone"
              >
                {collection.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collection.mobileImage ?? collection.image}
                      alt={collection.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out md:hidden"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collection.image}
                      alt={collection.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out hidden md:block"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-5xl md:text-7xl text-ink/10 tracking-tight">
                      {collection.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
                <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 text-white max-w-lg">
                  <p className="font-mono text-white/60 uppercase tracking-[0.35em] text-[10px] mb-3 block">
                    Featured collection
                  </p>
                  <h3 className="font-display text-3xl md:text-5xl text-white tracking-tight font-bold leading-none">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="font-body text-sm md:text-base text-white/75 mt-3 leading-relaxed line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 font-body text-sm font-semibold text-white mt-5 group-hover:gap-3 transition-all">
                    Shop now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {collectionProducts.length > 0 && (
              <div className="mt-8 md:mt-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-4 md:gap-6 min-w-max">
                  {collectionProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ delay: idx * 0.06, duration: 0.5 }}
                      className="w-[45vw] sm:w-[260px] shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
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
