import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import { GarmentTag } from '@/components/GarmentTag';
import { Metadata } from 'next';
import { MotionSection } from '@/components/MotionSection';
import Image from 'next/image';
import { StickyAddToCart } from '@/components/StickyAddToCart';

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
    <main className="max-w-5xl mx-auto px-4 py-12 md:py-24">
      <MotionSection className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-[4/5] bg-slate/10">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" placeholder="blur" blurDataURL={product.images[0]} />
        </div>
        <div>
          <h1 className="font-display text-5xl mb-4 text-navy tracking-[0.02em]">{product.name}</h1>
          <p className="text-3xl mb-8 font-mono text-forest">৳{product.price}</p>
          <GarmentTag size="M" color="NVY" sku={product.id.toUpperCase()} className="mb-8" />
          <p className="text-slate mb-10 font-body leading-relaxed">{product.description}</p>
          
          <div className="flex gap-4">
            <button className="bg-forest text-bone px-10 py-4 font-body uppercase tracking-[0.05em] hover:opacity-90">Add to Cart</button>
            <a 
              href={`https://m.me/yourbrand?text=I%20want%20to%20order:%20${product.name}%20–%20Size%20M%20–%20৳${product.price}`}
              className="border border-forest text-forest px-10 py-4 font-body uppercase tracking-[0.05em] hover:bg-forest hover:text-bone"
            >
              Order via Messenger
            </a>
          </div>
        </div>
      </MotionSection>
      <StickyAddToCart product={product} />
    </main>
  );
}
