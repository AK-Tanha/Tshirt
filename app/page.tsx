import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { MotionSection } from '@/components/MotionSection';

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <MotionSection className="relative h-[80vh] flex items-end mb-24 p-12">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hero/1600/900')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
        <div className="relative z-10 text-bone">
          <h1 className="font-display text-5xl md:text-8xl tracking-[0.02em] mb-4">APAN APPAREL</h1>
          <p className="font-body text-xl">Premium Polos and T-Shirts.</p>
        </div>
      </MotionSection>

      <MotionSection className="grid grid-cols-2 gap-6 mb-24">
        <Link href="/products?category=polo" className="bg-forest text-bone p-12 font-display text-4xl text-center hover:bg-navy transition-colors">POLOS</Link>
        <Link href="/products?category=tshirt" className="bg-forest text-bone p-12 font-display text-4xl text-center hover:bg-navy transition-colors">T-SHIRTS</Link>
      </MotionSection>

      <MotionSection>
        <h2 className="font-display text-4xl mb-12">FEATURED</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </MotionSection>
    </main>
  );
}
