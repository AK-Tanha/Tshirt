'use client';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MotionSection } from '@/components/MotionSection';

function ProductContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return (
    <MotionSection>
      <h1 className="font-display text-4xl mb-12 text-navy tracking-[0.02em]">
        {category ? category.toUpperCase() + 'S' : 'ALL PRODUCTS'}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </MotionSection>
  );
}

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductContent />
      </Suspense>
    </main>
  );
}
