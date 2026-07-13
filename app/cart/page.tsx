'use client';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { MotionSection } from '@/components/MotionSection';

export default function CartPage() {
 const { state, dispatch } = useCart();
 
 const cartProducts = state.items.map(item => ({
 ...item,
 product: products.find(p => p.id === item.productId)!
 }));

 const subtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

 return (
 <main className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
 <MotionSection>
 <div className="flex justify-between items-end mb-10 border-b border-border pb-8">
 <div>
 <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">Your Selection</span>
 <h1 className="font-display text-5xl md:text-7xl text-black tracking-tight leading-none font-bold">Bag</h1>
 </div>
 <span className="font-body text-sm text-muted">{cartProducts.length} Items</span>
 </div>

 {cartProducts.length === 0 ? (
 <div className="py-16 text-center">
 <p className="font-body text-muted mb-6">Your bag is empty.</p>
 <Link href="/products" className="inline-block bg-black text-white px-12 py-4 font-body text-sm font-medium rounded-lg hover:bg-black/90 transition-all">
 Return to Shop
 </Link>
 </div>
 ) : (
 <div className="grid lg:grid-cols-12 gap-12">
 <div className="lg:col-span-8">
 {cartProducts.map(item => (
 <div key={item.productId} className="group border-b border-border py-8 flex gap-6 items-start">
 <div className="relative w-24 md:w-28 aspect-[4/5] bg-stone rounded-lg overflow-hidden">
 <Image src={item.product.heroImage} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
 </div>
 <div className="flex-1">
 <div className="flex justify-between items-start gap-4">
 <div>
 <h3 className="font-display text-xl md:text-2xl text-black tracking-tight leading-none font-bold mb-1">{item.product.name}</h3>
 <p className="font-body text-sm text-muted">{item.product.category}</p>
 </div>
 <p className="font-body text-base text-black font-semibold whitespace-nowrap">৳{item.product.price}</p>
 </div>
 <div className="flex justify-between items-end mt-4">
 <span className="font-body text-sm text-muted">Qty: {item.quantity}</span>
 <button 
 onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })} 
 className="font-body text-sm text-muted hover:text-black transition-colors"
 >
 Remove
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 
 <div className="lg:col-span-4">
 <div className="sticky top-32 bg-stone rounded-xl p-6 border border-border">
 <h2 className="font-display text-xl text-black tracking-tight font-bold mb-6">Summary</h2>
 <div className="space-y-3 mb-6">
 <div className="flex justify-between font-body text-sm text-muted">
 <span>Subtotal</span>
 <span>৳{subtotal}</span>
 </div>
 <div className="flex justify-between font-body text-sm text-muted">
 <span>Shipping</span>
 <span>Calculated at next step</span>
 </div>
 </div>
 <div className="flex justify-between font-display text-lg text-black font-bold border-t border-border pt-4 mb-6">
 <span>Total</span>
 <span>৳{subtotal}</span>
 </div>
 <Link href="/checkout" className="block w-full text-center bg-black text-white py-4 font-body text-sm font-medium rounded-lg hover:bg-black/90 transition-all">
 Proceed to Checkout
 </Link>
 </div>
 </div>
 </div>
 )}
 </MotionSection>
 </main>
 );
}
