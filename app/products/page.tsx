"use client";
import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCollections } from "@/hooks/use-collections";
import { ProductCard } from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MotionSection } from "@/components/MotionSection";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

function ProductContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const collectionSlug = searchParams.get("collection");
  const [sort, setSort] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);

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

  const sortedProducts = useMemo(() => {
    const list = products?.data ? [...products.data] : [];
    switch (sort) {
      case "price-asc":
        return list.sort(
          (a, b) => Number(a.basePrice) - Number(b.basePrice),
        );
      case "price-desc":
        return list.sort(
          (a, b) => Number(b.basePrice) - Number(a.basePrice),
        );
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      default:
        return list;
    }
  }, [products, sort]);

  const activeCollections = (collections ?? []).filter((c) => c.isActive);

  if (categoriesLoading || collectionsLoading || productsLoading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-body text-muted animate-pulse">Loading...</p>
      </div>
    );

  const sortLabels: Record<SortKey, string> = {
    featured: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    newest: "Newest",
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <MotionSection className="pt-6 md:pt-14">
        <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
          Collection 2026
        </span>
        <h1 className="font-display text-5xl md:text-7xl text-ink tracking-tight leading-none font-bold">
          {activeCollection
            ? activeCollection.name
            : activeCategory
              ? activeCategory.name
              : "All Products"}
        </h1>
        {activeCollection?.description && (
          <p className="font-body text-muted text-sm md:text-base mt-4 max-w-lg leading-relaxed">
            {activeCollection.description}
          </p>
        )}
      </MotionSection>

      {/* Filter chips — categories + collections */}
      <div className="no-scrollbar -mx-5 px-page overflow-x-auto md:mx-0 md:px-0">
        <div className="flex items-center gap-2 md:flex-wrap md:gap-3 pb-1 md:pb-0 md:border-b md:border-border">
          <Link
            href="/products"
            className={`shrink-0 rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-colors ${
              !categorySlug && !collectionSlug
                ? "bg-ink text-white border-ink"
                : "border-border text-ink/70 hover:border-ink"
            }`}
          >
            All
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-colors ${
                categorySlug === cat.slug
                  ? "bg-ink text-white border-ink"
                  : "border-border text-ink/70 hover:border-ink"
              }`}
            >
              {cat.name}
            </Link>
          ))}
          {activeCollections.length > 0 && (
            <>
              <span className="hidden md:block w-px h-5 bg-border mx-1 shrink-0" />
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-muted pl-1">
                Collections
              </span>
              {activeCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/products?collection=${col.slug}`}
                  className={`shrink-0 rounded-full border px-4 py-2 font-body text-[13px] font-medium transition-colors ${
                    collectionSlug === col.slug
                      ? "bg-tan text-ink border-tan"
                      : "border-border text-ink/70 hover:border-ink"
                  }`}
                >
                  {col.name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted">
          <span className="font-semibold text-ink">
            {sortedProducts.length}
          </span>{" "}
          items
        </p>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 border border-border rounded-full pl-4 pr-3 py-2 font-body text-[13px] text-ink hover:border-ink transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
            <span className="hidden sm:inline">{sortLabels[sort]}</span>
            <span className="sm:hidden">Sort</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted transition-transform ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-2xl shadow-xl p-1.5 z-30">
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSort(key);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-body text-[13px] transition-colors ${
                    sort === key
                      ? "bg-stone text-ink font-semibold"
                      : "text-ink/70 hover:bg-stone"
                  }`}
                >
                  {sortLabels[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <MotionSection className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </MotionSection>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="px-page max-w-7xl mx-auto pb-16 md:pb-28">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductContent />
      </Suspense>
    </main>
  );
}
