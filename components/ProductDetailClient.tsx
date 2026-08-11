"use client";
import { useState } from "react";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  RotateCcw,
  MessageCircle,
  Minus,
  Plus,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useCart } from '@/context/CartContext';
import { getHeroImage, orderImages } from '@/lib/utils';

export const ProductDetailClient = ({ product }: { product: Product }) => {
  const galleryImages = orderImages(product.images);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size ?? "M",
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    const selectedVariant = product.variants.find(
      (v) => v.size === selectedSize,
    );
    if (!selectedVariant) return;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        image: getHeroImage(product.images)?.url ?? "/placeholder.png",
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: Number(selectedVariant.price ?? product.basePrice),
        stock: selectedVariant.stock,
        quantity,
      },
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const selectedVariant = product.variants.find((v) => v.size === selectedSize);
  const price = selectedVariant?.price ?? product.basePrice;

  return (
    <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <Link
          href="/products"
          className="lg:hidden font-mono text-[10px] text-muted uppercase tracking-[0.2em] hover:text-ink transition-colors flex items-center gap-1.5 mb-4"
        >
          <ChevronLeft className="w-3 h-3" /> Back to shop
        </Link>
        <div className="relative aspect-[4/5] bg-stone rounded-2xl md:rounded-3xl overflow-hidden">
          <Image
            src={galleryImages[selectedImage]?.url ?? "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
          />
          {product.category?.name && (
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ink font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
              {product.category.name}
            </span>
          )}
        </div>
        {galleryImages.length > 1 && (
          <div className="no-scrollbar flex gap-3 mt-3 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative aspect-square bg-stone rounded-xl overflow-hidden shrink-0 w-20 md:w-full transition-all ${
                  selectedImage === i
                    ? "ring-2 ring-ink ring-offset-2 ring-offset-bg-primary"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <Link
            href="/products"
            className="hidden lg:inline font-mono text-[10px] text-muted uppercase tracking-[0.2em] hover:text-ink transition-colors flex items-center gap-1.5 mb-5"
          >
            <ChevronLeft className="w-3 h-3" /> Shop /{" "}
            <span className="text-ink">{product.category.name}</span>
          </Link>

          <h1 className="font-display text-3xl md:text-5xl text-ink tracking-tight leading-[1.05] font-bold">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl font-display text-ink mt-3 font-semibold">
            ৳{Number(price).toLocaleString()}
          </p>
          <p className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mt-1">
            Cash on delivery available
          </p>

          {product.description && (
            <p className="text-muted font-body text-sm leading-relaxed mt-6">
              {product.description}
            </p>
          )}

          {/* Size selector */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-muted uppercase tracking-[0.2em]">
                Select size
              </span>
              <span className="font-mono text-[10px] text-ink/50 uppercase tracking-[0.2em]">
                {selectedVariant
                  ? `${selectedVariant.stock} in stock`
                  : "Sold out"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const active = selectedSize === variant.size;
                const soldOut = variant.stock <= 0;
                return (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedSize(variant.size)}
                    disabled={soldOut}
                    className={`relative min-w-[52px] h-12 rounded-xl font-mono text-xs font-medium transition-all ${
                      active
                        ? "bg-ink text-white shadow-lg shadow-ink/10"
                        : soldOut
                          ? "bg-stone text-muted/50 line-through cursor-not-allowed"
                          : "bg-white text-ink border border-border hover:border-ink"
                    }`}
                  >
                    {variant.size}
                    {active && (
                      <Check className="w-3 h-3 absolute -top-1.5 -right-1.5 bg-ink text-white rounded-full p-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted uppercase tracking-[0.2em]">
              Qty
            </span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-stone transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-stone transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full font-body font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-ink text-white hover:bg-ink/90 shadow-lg shadow-ink/10"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Bag · ৳
                  {(
                    Number(price) * quantity
                  ).toLocaleString()}
                </>
              )}
            </button>
            <a
              href={`https://m.me/yourbrand?text=I want to order: ${product.name} – Size ${selectedSize} – ৳${price}`}
              className="w-full border border-border text-ink py-4 rounded-full font-body text-sm font-medium text-center hover:bg-stone transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Order via Messenger
            </a>
          </div>

          {/* Perks */}
          <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono text-[10px] text-ink uppercase tracking-[0.2em] block mb-1">
                  Shipping
                </span>
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.2em]">
                  Free in Dhaka · 2–4 days
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono text-[10px] text-ink uppercase tracking-[0.2em] block mb-1">
                  Returns
                </span>
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.2em]">
                  7-day exchange
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
