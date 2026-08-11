"use client";
import { useState } from "react";
import { getHeroImage } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingBag, Check } from "lucide-react";

export interface ProductCardData {
  id: string;
  name: string;
  basePrice: string;
  category?: { name: string } | null;
  images: { url: string; isHero?: boolean }[];
  variants?: {
    id: string;
    size: string;
    color: string;
    stock: number;
    price: string | null;
  }[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { dispatch } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const hero = getHeroImage(product.images);
  const hoverImage =
    product.images.find((img) => img.url !== hero?.url) ?? null;

  const variant =
    product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];
  const inStock = variant ? variant.stock > 0 : true;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || variant.stock <= 0) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        image: hero?.url ?? "/placeholder.png",
        size: variant.size,
        color: variant.color,
        price: Number(variant.price ?? product.basePrice),
        stock: variant.stock,
        quantity: 1,
      },
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const info = (
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
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <Link href={`/products/${product.id}`} className="group block">
          <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-stone">
            <Image
              src={hero?.url || "/placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 opacity-100 group-hover:opacity-0 transition-all duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {product.category?.name && (
              <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-ink font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            {!inStock && (
              <span className="absolute bottom-2.5 left-2.5 bg-ink/85 text-white font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
                Sold out
              </span>
            )}
          </div>
        </Link>

        {variant && (
          <button
            onClick={handleAdd}
            disabled={variant.stock <= 0}
            aria-label={`Add ${product.name} to bag`}
            className={`absolute bottom-2 right-2 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
              justAdded
                ? "bg-emerald-600 text-white"
                : variant.stock <= 0
                  ? "bg-white/60 text-muted cursor-not-allowed"
                  : "bg-ink text-white hover:bg-ink/90 hover:scale-105"
            }`}
          >
            {justAdded ? (
              <Check className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>
        )}
      </div>
      <Link href={`/products/${product.id}`} className="block">
        {info}
      </Link>
    </motion.div>
  );
};
