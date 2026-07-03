import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { GarmentTag } from './GarmentTag';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.slug}`} className="block border border-slate p-4 bg-bone hover:border-navy transition-colors">
      <div className="relative aspect-[4/5] mb-4">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
      </div>
      <h3 className="font-display text-lg text-navy mb-1">{product.name}</h3>
      <p className="font-mono text-sm text-forest mb-3">৳{product.price}</p>
      <GarmentTag size="S-XXL" color="NVY" sku={product.id.toUpperCase()} />
    </Link>
  );
};
