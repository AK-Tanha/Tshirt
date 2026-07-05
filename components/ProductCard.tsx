'use client';
import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { GarmentTag } from './GarmentTag';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block border border-slate/10 p-2 bg-bone hover:border-forest transition-colors duration-500">
        <div className="relative aspect-[4/5] mb-6 overflow-hidden">
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-full bg-bone text-navy font-body text-[10px] uppercase tracking-widest py-3 hover:bg-forest hover:text-bone transition-colors">
              Quick View
            </button>
          </div>
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-display text-lg text-navy mb-1 uppercase tracking-tight group-hover:text-forest transition-colors">{product.name}</h3>
            <p className="font-mono text-[10px] text-slate/60 uppercase tracking-widest">{product.category}</p>
          </div>
          <p className="font-mono text-sm text-forest font-bold">৳{product.price}</p>
        </div>
        <GarmentTag size="S-XXL" color="NVY" sku={product.id.toUpperCase()} className="opacity-60 group-hover:opacity-100 transition-opacity" />
      </Link>
    </motion.div>
  );
};
