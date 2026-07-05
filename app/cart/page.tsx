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
        <div className="flex justify-between items-end mb-10 border-b border-slate/10 pb-8">
          <div>
            <span className="font-mono text-forest uppercase tracking-[0.3em] text-[10px] mb-2 block">Your Selection</span>
            <h1 className="font-display text-6xl md:text-8xl text-navy tracking-tight leading-none uppercase italic">Bag</h1>
          </div>
          <span className="font-mono text-[10px] text-slate/40 uppercase tracking-widest">{cartProducts.length} Items</span>
        </div>

        {cartProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-body text-slate mb-6">Your bag is currently empty.</p>
            <Link href="/products" className="inline-block border border-navy px-12 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-navy hover:text-bone transition-all">
              Return to Archive
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              {cartProducts.map(item => (
                <div key={item.productId} className="group border-b border-slate/10 py-8 flex gap-8 items-start">
                   <div className="relative w-28 aspect-[4/5] bg-slate/5 overflow-hidden">
                     <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-2xl text-navy uppercase tracking-tight leading-none mb-1">{item.product.name}</h3>
                        <p className="font-mono text-[10px] text-slate/60 uppercase tracking-widest mb-3">{item.product.category}</p>
                      </div>
                      <p className="font-mono text-base text-forest">৳{item.product.price}</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                       <span className="font-mono text-[10px] text-slate/40 uppercase tracking-widest">Qty: {item.quantity}</span>
                       <button 
                         onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })} 
                        className="font-mono text-[10px] text-red-800 uppercase tracking-widest border-b border-transparent hover:border-red-800 pb-0.5 transition-all"
                       >
                        Remove
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-4">
              <div className="sticky top-32 bg-slate/5 p-6 border border-slate/10">
                <h2 className="font-display text-2xl text-navy uppercase tracking-tight mb-6">Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-slate">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-slate">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                </div>
                <div className="flex justify-between font-display text-xl text-navy uppercase tracking-tight border-t border-slate/10 pt-4 mb-6">
                  <span>Total</span>
                  <span>৳{subtotal}</span>
                </div>
                <Link href="/checkout" className="block w-full text-center bg-forest text-bone py-4 font-body uppercase text-xs tracking-widest hover:bg-navy transition-all duration-500 shadow-xl shadow-forest/10">
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
