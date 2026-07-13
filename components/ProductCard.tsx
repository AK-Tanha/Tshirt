'use client';
import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

interface ProductCardProps {
 product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
 return (
 <motion.div
 whileHover={{ y: -6 }}
 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
 >
 <Link href={`/products/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500">
 <div className="relative aspect-[4/5] overflow-hidden bg-stone">
 <Image 
 src={product.heroImage} 
 alt={product.name} 
 fill 
 className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
 referrerPolicy="no-referrer" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 </div>
 <div className="p-3 md:p-4">
 <h3 className="font-display text-sm md:text-lg text-black leading-tight tracking-tight font-bold">{product.name}</h3>
 <div className="flex items-center gap-2 mt-1">
 <p className="font-body text-[11px] md:text-xs text-muted">{product.category}</p>
 <span className="text-muted/30">·</span>
 <p className="font-body text-sm md:text-base text-black font-semibold">৳{product.price}</p>
 </div>
 </div>
 </Link>
 </motion.div>
 );
};
