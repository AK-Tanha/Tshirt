'use client';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { MotionSection } from '@/components/MotionSection';
import { Marquee } from '@/components/Marquee';
import { motion } from 'motion/react';

export default function Home() {
  const featured = products.slice(0, 4);
  const categories = [
    { id: 'polo', name: 'Polos', label: 'Classic Staples' },
    { id: 'tshirt', name: 'Tees', label: 'Essential Basics' }
  ];

  return (
    <main className="pb-24">
      {/* Editorial Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-navy flex items-center">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://picsum.photos/seed/apparel/1920/1080')] bg-cover bg-center" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="font-mono text-forest uppercase tracking-[0.4em] text-xs mb-6 block">Collection 2026</span>
              <h1 className="font-display text-7xl md:text-[10rem] text-bone leading-[0.8] mb-8 tracking-tighter uppercase">
                Future <br />
                <span className="text-forest italic">Legacy</span>
              </h1>
              <div className="flex gap-4">
                <Link href="/products" className="bg-forest text-bone px-10 py-4 font-body uppercase text-xs tracking-widest hover:bg-bone hover:text-navy transition-all duration-300">
                  Explore Archive
                </Link>
                <Link href="/products?category=polo" className="border border-bone/20 text-bone px-10 py-4 font-body uppercase text-xs tracking-widest hover:bg-bone hover:text-navy transition-all duration-300">
                  Shop Polos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-12 right-12 hidden md:block">
          <div className="font-mono text-[10px] text-bone/40 uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            Crafted in Bangladesh
          </div>
        </div>
      </section>

      <Marquee text="New Arrivals • Limited Edition • Premium Quality • Apan Apparel •" className="bg-bone" />

      {/* Featured Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 border-t border-slate/10">
        <div className="flex justify-between items-end mb-10">
          <MotionSection>
            <span className="font-mono text-forest uppercase tracking-widest text-[10px] mb-2 block">Curation</span>
            <h2 className="font-display text-5xl md:text-7xl text-navy uppercase tracking-tighter">Featured items</h2>
          </MotionSection>
          <Link href="/products" className="font-mono text-[10px] text-slate uppercase tracking-widest border-b border-slate/40 pb-1 hover:text-forest hover:border-forest transition-all">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Category Sections */}
      {categories.map((cat) => {
        const categoryProducts = products.filter(p => p.category === cat.id).slice(0, 4);
        return (
          <section key={cat.id} className="max-w-7xl mx-auto px-6 md:px-12 pt-16 border-t border-slate/10">
            <div className="flex justify-between items-end mb-10">
              <MotionSection>
                <span className="font-mono text-forest uppercase tracking-widest text-[10px] mb-2 block">{cat.label}</span>
                <h2 className="font-display text-5xl md:text-7xl text-navy uppercase tracking-tighter">{cat.name}</h2>
              </MotionSection>
              <Link href={`/products?category=${cat.id}`} className="font-mono text-[10px] text-slate uppercase tracking-widest border-b border-slate/40 pb-1 hover:text-forest hover:border-forest transition-all">
                See all {cat.name}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {categoryProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
