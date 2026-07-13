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
 images: [product.heroImage],
 },
 };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const product = products.find(p => p.slug === slug);
 if (!product) notFound();

 return (
 <main className="max-w-7xl mx-auto px-4 md:px-12 pb-24 md:pb-32">
 <ProductDetailClient product={product} />
 <StickyAddToCart product={product} />
 </main>
 );
}
