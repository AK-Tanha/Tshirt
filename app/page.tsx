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
 {/* Hero */}
 <section className="relative h-screen w-full overflow-hidden bg-black flex items-center">
 <motion.div 
 initial={{ scale: 1.1, opacity: 0 }}
 animate={{ scale: 1, opacity: 0.5 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 className="absolute inset-0 bg-[url('https://picsum.photos/seed/apparel/1920/1080')] bg-cover bg-center" 
 />
 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
 
 <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
 <div className="max-w-2xl">
 <motion.div
 initial={{ y: 30, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.5, duration: 0.8 }}
 >
 <span className="font-mono text-white/40 uppercase tracking-widest text-xs mb-6 block">Collection 2026</span>
 <h1 className="font-display text-7xl md:text-[10rem] text-white leading-[0.85] mb-8 tracking-tighter font-bold">
 Future<br />Legacy
 </h1>
 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
 <Link href="/products" className="bg-white text-black px-8 sm:px-10 py-4 font-body text-sm font-medium hover:bg-white/90 transition-all duration-300 rounded-lg text-center">
 Explore Shop
 </Link>
 <Link href="/products?category=polo" className="border border-white/20 text-white px-8 sm:px-10 py-4 font-body text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 rounded-lg text-center">
 Shop Polos
 </Link>
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 <Marquee text="New Arrivals • Limited Edition • Premium Quality • Apan Apparel •" />

 {/* Featured Grid */}
 <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20">
 <div className="flex justify-between items-end mb-12">
 <MotionSection>
 <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">Curation</span>
 <h2 className="font-display text-4xl md:text-6xl text-black tracking-tight font-bold">Featured</h2>
 </MotionSection>
 <Link href="/products" className="font-body text-sm text-muted hover:text-black transition-colors">
 See all →
 </Link>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
 <section key={cat.id} className="max-w-7xl mx-auto px-6 md:px-12 pt-20">
 <div className="flex justify-between items-end mb-12">
 <MotionSection>
 <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">{cat.label}</span>
 <h2 className="font-display text-4xl md:text-6xl text-black tracking-tight font-bold">{cat.name}</h2>
 </MotionSection>
 <Link href={`/products?category=${cat.id}`} className="font-body text-sm text-muted hover:text-black transition-colors">
 See all →
 </Link>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
