"use client";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MotionSection } from "@/components/MotionSection";
import Link from "next/link";

function ProductContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // resolve slug -> id, since the backend filters by categoryId
  const activeCategory = categories?.find((c) => c.slug === categorySlug);

  const { data: products, isLoading: productsLoading } = useProducts({
    categoryId: activeCategory?.id,
    limit: 50,
  });

  if (categoriesLoading || productsLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-12">
      <MotionSection className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
        <div>
          <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">
            Collection 2026
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-black tracking-tight leading-none font-bold">
            {activeCategory ? activeCategory.name : "Products"}
          </h1>
        </div>

        <div className="flex gap-6 font-body text-sm text-muted">
          <Link
            href="/products"
            className={`${!categorySlug ? "text-black font-medium" : "hover:text-black"} transition-colors`}
          >
            All
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`${categorySlug === cat.slug ? "text-black font-medium" : "hover:text-black"} transition-colors`}
            >
              {cat.name}
            </Link>
          ))}
          <span className="ml-2 text-muted/40">
            {products?.data.length ?? 0} items
          </span>
        </div>
      </MotionSection>

      <MotionSection className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
        {products?.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </MotionSection>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 pb-12 md:pb-24">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductContent />
      </Suspense>
    </main>
  );
}