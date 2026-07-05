'use client';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MotionSection } from '@/components/MotionSection';

import Link from 'next/link';

function ProductContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return (
    <div className="flex flex-col gap-12">
      <MotionSection className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate/10 pb-8">
        <div>
          <span className="font-mono text-forest uppercase tracking-[0.3em] text-[10px] mb-2 block">Collection 2026</span>
          <h1 className="font-display text-6xl md:text-8xl text-navy tracking-tight leading-none uppercase italic">
            {category ? category : 'Archive'}
          </h1>
        </div>
        <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest text-slate/40">
          <Link href="/products" className={`${!category ? 'text-forest border-b border-forest' : 'hover:text-navy'} pb-1 transition-all`}>All</Link>
          <Link href="/products?category=polo" className={`${category === 'polo' ? 'text-forest border-b border-forest' : 'hover:text-navy'} pb-1 transition-all`}>Polos</Link>
          <Link href="/products?category=tshirt" className={`${category === 'tshirt' ? 'text-forest border-b border-forest' : 'hover:text-navy'} pb-1 transition-all`}>Tees</Link>
          <span className="ml-4 text-navy/20">{filteredProducts.length} Items</span>
        </div>
      </MotionSection>

      <MotionSection className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {filteredProducts.map((product, idx) => (
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
