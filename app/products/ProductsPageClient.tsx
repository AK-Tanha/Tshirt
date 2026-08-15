"use client";
import { useMemo, useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCollections } from "@/hooks/use-collections";
import { ProductCard } from "@/components/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { MotionSection } from "@/components/MotionSection";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Check,
  ListFilter,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Collection } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL"];

function sortSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

interface FilterPanelProps {
  categories: Category[];
  collections: Collection[];
  activeCategoryId?: string;
  activeCollectionId?: string;
  availableSizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  onSelectCategory: (slug?: string) => void;
  onSelectCollection: (slug?: string) => void;
  onClearAll: () => void;
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
      {title}
    </h4>
    {children}
  </div>
);

const rowClasses = (active: boolean) =>
  cn(
    "w-full flex items-center justify-between gap-2 py-1.5 text-left font-body text-sm transition-colors",
    active ? "text-ink font-semibold" : "text-ink/55 hover:text-ink",
  );

const FilterPanel = ({
  categories,
  collections,
  activeCategoryId,
  activeCollectionId,
  availableSizes,
  selectedSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onSelectCategory,
  onSelectCollection,
  onClearAll,
}: FilterPanelProps) => (
  <div className="flex flex-col gap-8">
    {/* Categories */}
    <FilterSection title="Categories">
      <div className="flex flex-col">
        <button
          onClick={() => onSelectCategory(undefined)}
          className={rowClasses(!activeCategoryId && !activeCollectionId)}
        >
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "w-1 h-1 rounded-full transition-colors",
                !activeCategoryId && !activeCollectionId
                  ? "bg-tan"
                  : "bg-transparent",
              )}
            />
            All categories
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={rowClasses(activeCategoryId === cat.id)}
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "w-1 h-1 rounded-full transition-colors",
                  activeCategoryId === cat.id ? "bg-tan" : "bg-transparent",
                )}
              />
              {cat.name}
            </span>
            <span className="font-mono text-[10px] text-muted">
              {cat._count?.products ?? ""}
            </span>
          </button>
        ))}
      </div>
    </FilterSection>

    {/* Collections */}
    {collections.length > 0 && (
      <FilterSection title="Collections">
        <div className="flex flex-col">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelectCollection(col.slug)}
              className={rowClasses(activeCollectionId === col.id)}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-1 h-1 rounded-full transition-colors",
                    activeCollectionId === col.id ? "bg-tan" : "bg-transparent",
                  )}
                />
                {col.name}
              </span>
              {col._count?.products != null && (
                <span className="font-mono text-[10px] text-muted">
                  {col._count.products}
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>
    )}

    {/* Sizes */}
    {availableSizes.length > 0 && (
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={cn(
                "min-w-9 h-9 px-2 rounded-full border font-body text-[12px] font-medium transition-colors",
                selectedSizes.includes(size)
                  ? "bg-ink text-white border-ink"
                  : "border-border text-ink/60 hover:border-ink",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>
    )}

    {/* Price */}
    <FilterSection title="Price">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">
            ৳
          </span>
          <input
            type="number"
            min={0}
            value={minPrice}
            placeholder="Min"
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full bg-transparent border border-border rounded-lg pl-7 pr-2.5 py-2 font-body text-sm text-ink placeholder:text-muted/70 focus:border-ink outline-none transition-colors"
          />
        </div>
        <span className="font-mono text-xs text-muted">—</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">
            ৳
          </span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            placeholder="Max"
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full bg-transparent border border-border rounded-lg pl-7 pr-2.5 py-2 font-body text-sm text-ink placeholder:text-muted/70 focus:border-ink outline-none transition-colors"
          />
        </div>
      </div>
    </FilterSection>

    <button
      onClick={onClearAll}
      className="font-body text-xs text-muted hover:text-ink transition-colors text-left"
    >
      Clear all filters
    </button>
  </div>
);

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get("category") ?? undefined;
  const collectionSlug = searchParams.get("collection") ?? undefined;

  const searchParam = searchParams.get("search") ?? "";

  const [sort, setSort] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  // keep the local search in sync when the URL changes (e.g. hero search submit)
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setQuery(searchParam);
  }
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: collections, isLoading: collectionsLoading } =
    useCollections();

  const activeCategory = categories?.find((c) => c.slug === categorySlug);
  const activeCollection = collections?.find((c) => c.slug === collectionSlug);

  const { data: products, isLoading: productsLoading } = useProducts({
    categoryId: activeCollection ? undefined : activeCategory?.id,
    collectionId: activeCollection?.id,
    limit: 50,
  });

  const list = useMemo(() => products?.data ?? [], [products]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    list.forEach((p) =>
      p.variants?.forEach((v) => {
        if (v.size) set.add(v.size);
      }),
    );
    return sortSizes(Array.from(set));
  }, [list]);

  const activeCollections = (collections ?? []).filter((c) => c.isActive);

  const filteredProducts = useMemo(() => {
    let result = list;
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) => selectedSizes.includes(v.size)),
      );
    }
    const mn = parseFloat(minPrice);
    const mx = parseFloat(maxPrice);
    if (!isNaN(mn)) {
      result = result.filter((p) => Number(p.basePrice) >= mn);
    }
    if (!isNaN(mx)) {
      result = result.filter((p) => Number(p.basePrice) <= mx);
    }
    return result;
  }, [list, query, selectedSizes, minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    switch (sort) {
      case "price-asc":
        return result.sort(
          (a, b) => Number(a.basePrice) - Number(b.basePrice),
        );
      case "price-desc":
        return result.sort(
          (a, b) => Number(b.basePrice) - Number(a.basePrice),
        );
      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      default:
        return result;
    }
  }, [filteredProducts, sort]);

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const navigateCategory = (slug?: string) => {
    setDrawerOpen(false);
    if (slug) router.push(`/products?category=${slug}`);
    else if (collectionSlug) router.push(`/products?collection=${collectionSlug}`);
    else router.push("/products");
  };

  const navigateCollection = (slug?: string) => {
    setDrawerOpen(false);
    if (slug) router.push(`/products?collection=${slug}`);
    else if (categorySlug) router.push(`/products?category=${categorySlug}`);
    else router.push("/products");
  };

  const clearAll = () => {
    setDrawerOpen(false);
    router.push("/products");
    setQuery("");
    setSelectedSizes([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  const activeCount =
    (activeCategory ? 1 : 0) +
    (activeCollection ? 1 : 0) +
    (query ? 1 : 0) +
    selectedSizes.length +
    (minPrice || maxPrice ? 1 : 0);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (categoriesLoading || collectionsLoading || productsLoading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-body text-muted animate-pulse">Loading...</p>
      </div>
    );

  const title = activeCollection
    ? activeCollection.name
    : activeCategory
      ? activeCategory.name
      : "All Products";

  const description = activeCollection?.description;

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (categorySlug)
    activeChips.push({
      label: activeCategory?.name ?? categorySlug,
      onRemove: () => navigateCategory(undefined),
    });
  if (collectionSlug)
    activeChips.push({
      label: activeCollection?.name ?? collectionSlug,
      onRemove: () => navigateCollection(undefined),
    });
  if (query)
    activeChips.push({ label: `“${query}”`, onRemove: () => setQuery("") });
  selectedSizes.forEach((s) =>
    activeChips.push({ label: s, onRemove: () => toggleSize(s) }),
  );
  if (minPrice)
    activeChips.push({
      label: `From ৳${minPrice}`,
      onRemove: () => setMinPrice(""),
    });
  if (maxPrice)
    activeChips.push({
      label: `Up to ৳${maxPrice}`,
      onRemove: () => setMaxPrice(""),
    });

  const filterPanelProps: FilterPanelProps = {
    categories: categories ?? [],
    collections: activeCollections,
    activeCategoryId: activeCategory?.id,
    activeCollectionId: activeCollection?.id,
    availableSizes,
    selectedSizes,
    onToggleSize: toggleSize,
    minPrice,
    maxPrice,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onSelectCategory: navigateCategory,
    onSelectCollection: navigateCollection,
    onClearAll: clearAll,
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <header className="pt-6 md:pt-14">
        <nav className="flex items-center gap-1.5 font-body text-xs text-muted mb-5 md:mb-6">
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="text-ink/20">/</span>
          <Link href="/products" className="hover:text-ink transition-colors">
            Shop
          </Link>
          {title !== "All Products" && (
            <>
              <span className="text-ink/20">/</span>
              <span className="text-ink">{title}</span>
            </>
          )}
        </nav>

        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
              The Apan Collection — 2026
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-ink tracking-tight leading-none font-bold">
              {title}
            </h1>
            {description && (
              <p className="font-body text-muted text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <span className="font-display text-4xl md:text-5xl text-ink/10 font-bold leading-none">
              {sortedProducts.length}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              pieces
            </span>
          </div>
        </div>

        <div className="mt-8 md:mt-10 border-b border-border" />
      </header>

      <div className="flex gap-10 lg:gap-12">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 self-start max-h-[calc(100svh-7rem)] overflow-y-auto no-scrollbar pb-10">
            <FilterPanel {...filterPanelProps} />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Toolbar */}
          <div className="sticky top-14 md:top-16 z-30 bg-bg-primary/90 backdrop-blur-md py-3 -mx-5 px-page md:mx-0 md:px-0 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-border rounded-full px-4 py-2 font-body text-[13px] text-ink hover:border-ink transition-colors"
              >
                <ListFilter className="w-3.5 h-3.5 text-muted" />
                Filters
                {activeCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-ink text-white text-[9px] flex items-center justify-center font-mono">
                    {activeCount}
                  </span>
                )}
              </button>

              <p className="font-body text-sm text-muted hidden sm:block">
                <span className="font-semibold text-ink">
                  {sortedProducts.length}
                </span>{" "}
                items
              </p>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative items-center hidden md:flex">
                  <Search className="absolute left-3 w-3.5 h-3.5 text-muted pointer-events-none" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="w-44 lg:w-52 bg-transparent border border-border rounded-full pl-9 pr-8 py-2 font-body text-sm text-ink placeholder:text-muted/70 focus:border-ink outline-none transition-all"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2.5 text-muted hover:text-ink transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 border border-border rounded-full pl-4 pr-3 py-2 font-body text-[13px] text-ink hover:border-ink transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
                    <span className="hidden sm:inline">{sortLabels[sort]}</span>
                    <span className="sm:hidden">Sort</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted transition-transform",
                        sortOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {sortOpen && (
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setSortOpen(false)}
                    />
                  )}
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-2xl shadow-xl p-1.5 z-40"
                      >
                        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSort(key);
                              setSortOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between gap-2 text-left px-3.5 py-2.5 rounded-xl font-body text-[13px] transition-colors",
                              sort === key
                                ? "bg-stone text-ink font-semibold"
                                : "text-ink/70 hover:bg-stone",
                            )}
                          >
                            {sortLabels[key]}
                            {sort === key && (
                              <Check className="w-3.5 h-3.5 text-ink" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile search */}
            <div className="relative flex items-center mt-3 md:hidden">
              <Search className="absolute left-3 w-3.5 h-3.5 text-muted pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent border border-border rounded-full pl-9 pr-8 py-2 font-body text-sm text-ink placeholder:text-muted/70 focus:border-ink outline-none transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 text-muted hover:text-ink transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeChips.map((chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-stone border border-border pl-3 pr-1.5 py-1 font-body text-xs text-ink"
                >
                  {chip.label}
                  <button
                    onClick={chip.onRemove}
                    className="w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center hover:bg-ink/80 transition-colors"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="font-body text-xs text-muted hover:text-ink transition-colors underline underline-offset-4"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {sortedProducts.length > 0 ? (
            <MotionSection className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </MotionSection>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-full bg-stone flex items-center justify-center mb-5">
                <PackageSearch className="w-6 h-6 text-muted" />
              </div>
              <h3 className="font-display text-2xl text-ink font-semibold">
                No products found
              </h3>
              <p className="font-body text-sm text-muted mt-2 max-w-xs leading-relaxed">
                Try adjusting or clearing your filters to see more pieces.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 bg-ink text-white rounded-full px-6 py-2.5 font-body text-[13px] font-medium hover:bg-ink/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-paper rounded-t-3xl max-h-[88svh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mx-auto mt-3 w-10 h-1 rounded-full bg-border shrink-0" />
              <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-border">
                <div>
                  <h2 className="font-display text-xl text-ink font-semibold">
                    Filters
                  </h2>
                  <p className="font-body text-xs text-muted mt-0.5">
                    {sortedProducts.length} matching pieces
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAll}
                    className="font-body text-xs text-muted hover:text-ink transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-stone flex items-center justify-center"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4 text-ink" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 pb-8">
                <FilterPanel {...filterPanelProps} />
              </div>

              <div className="px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border bg-paper shrink-0">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-ink text-white rounded-full py-3.5 font-body text-sm font-semibold"
                >
                  Show {sortedProducts.length} pieces
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductsPageClient() {
  return (
    <main className="px-page max-w-7xl mx-auto pb-16 md:pb-28">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductContent />
      </Suspense>
    </main>
  );
}