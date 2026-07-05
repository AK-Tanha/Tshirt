import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import { GarmentTag } from '@/components/GarmentTag';
import { Metadata } from 'next';
import { MotionSection } from '@/components/MotionSection';
import Image from 'next/image';
import { StickyAddToCart } from '@/components/StickyAddToCart';
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
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <div className="mb-8">
        <Link href="/products" className="font-mono text-[10px] text-slate/60 uppercase tracking-widest hover:text-forest transition-colors flex items-center gap-2">
          ← Archive / <span className="text-navy">{product.category}</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <MotionSection className="lg:col-span-7">
          <div className="relative aspect-[4/5] bg-slate/5 group overflow-hidden">
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover" 
              referrerPolicy="no-referrer" 
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className="relative aspect-square bg-slate/5">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-60" />
             </div>
             <div className="relative aspect-square bg-slate/5">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover opacity-60" />
             </div>
          </div>
        </MotionSection>

        <MotionSection className="lg:col-span-5">
          <div className="sticky top-32">
            <span className="font-mono text-forest uppercase tracking-[0.3em] text-[10px] mb-2 block">Limited Edition</span>
            <h1 className="font-display text-6xl md:text-8xl mb-4 text-navy tracking-tight leading-[0.9] uppercase italic">{product.name}</h1>
            <p className="text-4xl mb-8 font-display text-forest">৳{product.price}</p>
            
            <div className="mb-8">
              <span className="font-mono text-[10px] text-slate uppercase tracking-widest mb-3 block">Select Size</span>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className="w-10 h-10 border border-slate/20 font-mono text-[10px] hover:border-forest hover:bg-forest hover:text-bone transition-all">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <GarmentTag size="Multiple" color="NAVY / FOREST" sku={product.id.toUpperCase()} className="mb-8 w-full" />
            
            <p className="text-slate/80 mb-8 font-body text-sm leading-relaxed max-w-md">
              {product.description} Crafted with premium materials and designed for longevity. A staple piece for any modern archive.
            </p>
            
            <div className="flex flex-col gap-4">
              <button className="w-full bg-forest text-bone py-5 font-body uppercase text-xs tracking-widest hover:bg-navy transition-all duration-500 shadow-xl shadow-forest/10">
                Add to Bag
              </button>
              <a 
                href={`https://m.me/yourbrand?text=I%20want%20to%20order:%20${product.name}%20–%20Size%20M%20–%20৳${product.price}`}
                className="w-full border border-forest text-forest py-5 font-body uppercase text-xs tracking-widest text-center hover:bg-bone hover:text-navy transition-all"
              >
                Order via Messenger
              </a>
            </div>

            <div className="mt-12 pt-12 border-t border-slate/10 grid grid-cols-2 gap-8 font-mono text-[9px] text-slate/60 uppercase tracking-widest">
              <div>
                <span className="text-navy block mb-2">Shipping</span>
                Worldwide Delivery Available
              </div>
              <div>
                <span className="text-navy block mb-2">Returns</span>
                7-Day Easy Exchange
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
      <StickyAddToCart product={product} />
    </main>
  );
}
