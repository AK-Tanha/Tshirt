import { getHeroImage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export interface ProductCardData {
  id: string;
  name: string;
  basePrice: string;
  category?: { name: string } | null;
  images: { url: string; isHero?: boolean }[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hero = getHeroImage(product.images);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products/${product.id}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-stone">
          <Image
            src={hero?.url || "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {product.category?.name && (
            <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-ink font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
        </div>
        <div className="pt-3 md:pt-4 px-0.5">
          <h3 className="font-display text-sm md:text-lg text-ink leading-tight tracking-tight font-semibold line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body text-sm md:text-base text-ink font-semibold">
              ৳{Number(product.basePrice).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};