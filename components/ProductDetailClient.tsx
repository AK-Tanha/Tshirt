'use client';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { MotionSection } from './MotionSection';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, RotateCcw, MessageCircle, Minus, Plus, ChevronLeft } from 'lucide-react';

export const ProductDetailClient = ({ product }: { product: Product }) => {
 const [selectedSize, setSelectedSize] = useState<string>('M');
 const [quantity, setQuantity] = useState(1);
 const { dispatch } = useCart();

 const handleAddToCart = () => {
 dispatch({ type: 'ADD_ITEM', payload: { productId: product.id, quantity } });
 };

 return (
 <div className="grid lg:grid-cols-12 gap-6 md:gap-12">
 <MotionSection className="lg:col-span-7">
 <div className="relative aspect-[4/5] bg-stone rounded-2xl overflow-hidden group">
 <Image
 src={product.heroImage}
 alt={product.name}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
 referrerPolicy="no-referrer"
 priority
 />
 <div className="absolute top-4 left-4">
 <span className="bg-white/90 backdrop-blur-sm text-black font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">Limited</span>
 </div>
 </div>
 {product.extraImages.length > 0 && (
 <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
 {product.extraImages.map((img, i) => (
 <div key={i} className="relative aspect-square bg-stone rounded-xl overflow-hidden">
 <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700 ease-out" />
 </div>
 ))}
 </div>
 )}
 </MotionSection>

 <MotionSection className="lg:col-span-5">
 <div className="sticky top-28">
 <Link href="/products" className="font-mono text-[10px] text-muted uppercase tracking-widest hover:text-black transition-colors flex items-center gap-1.5 mb-6">
 <ChevronLeft className="w-3 h-3" /> Shop / <span className="text-black">{product.category}</span>
 </Link>

 <h1 className="font-display text-4xl md:text-6xl text-black tracking-tight leading-[0.9] font-bold">{product.name}</h1>
 <p className="text-2xl md:text-3xl font-display text-black mt-3 font-bold">৳{product.price}</p>

 <p className="text-muted font-body text-sm leading-relaxed mt-6">
 {product.description}
 </p>

 <div className="mt-8">
 <span className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-3">Select Size</span>
 <div className="flex gap-2">
 {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
 <button
 key={size}
 onClick={() => setSelectedSize(size)}
 className={`px-4 h-10 rounded-lg font-mono text-[10px] font-medium transition-all ${
 selectedSize === size
 ? 'bg-black text-white shadow-md'
 : 'bg-white text-black border border-border hover:border-black'
 }`}
 >
 {size}
 </button>
 ))}
 </div>
 </div>

 <div className="mt-6 flex items-center gap-4">
 <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Qty</span>
 <div className="flex items-center border border-border rounded-lg overflow-hidden">
 <button
 onClick={() => setQuantity(Math.max(1, quantity - 1))}
 className="p-2.5 hover:bg-stone transition-colors"
 >
 <Minus className="w-3 h-3" />
 </button>
 <span className="w-10 text-center font-mono text-xs">{quantity}</span>
 <button
 onClick={() => setQuantity(quantity + 1)}
 className="p-2.5 hover:bg-stone transition-colors"
 >
 <Plus className="w-3 h-3" />
 </button>
 </div>
 </div>

 <div className="flex flex-col gap-3 mt-8">
 <button
 onClick={handleAddToCart}
 className="w-full bg-black text-white py-4 rounded-xl font-body font-medium text-sm tracking-wider hover:bg-black/90 transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
 >
 <ShoppingBag className="w-4 h-4" />
 Add to Bag
 </button>
 <a
 href={`https://m.me/yourbrand?text=I want to order: ${product.name} – Size ${selectedSize} – ৳${product.price}`}
 className="w-full border border-border text-black py-4 rounded-xl font-body text-sm font-medium text-center hover:bg-stone transition-all flex items-center justify-center gap-2"
 >
 <MessageCircle className="w-4 h-4" />
 Order via Messenger
 </a>
 </div>

 <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-6">
 <div className="flex items-start gap-3">
 <Truck className="w-4 h-4 text-black/40 mt-0.5 shrink-0" />
 <div>
 <span className="font-mono text-[10px] text-black uppercase tracking-widest block mb-1">Shipping</span>
 <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Worldwide Delivery</span>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <RotateCcw className="w-4 h-4 text-black/40 mt-0.5 shrink-0" />
 <div>
 <span className="font-mono text-[10px] text-black uppercase tracking-widest block mb-1">Returns</span>
 <span className="font-mono text-[9px] text-muted uppercase tracking-widest">7-Day Exchange</span>
 </div>
 </div>
 </div>
 </div>
 </MotionSection>
 </div>
 );
};
