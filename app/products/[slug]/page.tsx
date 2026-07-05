import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { StickyAddToCart } from '@/components/StickyAddToCart';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24">
      <div className="mb-8">
        <Link href="/products" className="font-mono text-[10px] text-slate/60 uppercase tracking-widest hover:text-forest transition-colors flex items-center gap-2">
          ← Archive / <span className="text-navy">{product.category}</span>
        </Link>
      </div>
      <ProductDetailClient product={product} />
      <StickyAddToCart product={product} />
    </main>
  );
}
