'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { MotionSection } from '@/components/MotionSection';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
    // processOnlinePayment(); // Future SSLCommerz
    dispatch({ type: 'CLEAR_CART' });
    router.push(`/order/${orderId}`);
  };

  return (
    <main className="max-w-xl mx-auto px-6 pb-16 md:pb-24">
      <MotionSection>
        <div className="mb-12 border-b border-slate/10 pb-8">
          <span className="font-mono text-forest uppercase tracking-[0.3em] text-[10px] mb-2 block">Secured Entry</span>
          <h1 className="font-display text-6xl md:text-8xl text-navy tracking-tight leading-none uppercase italic text-center md:text-left">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <div>
              <label className="font-mono text-[10px] text-slate/40 uppercase tracking-widest mb-3 block">Shipping Recipient</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border-b border-slate/20 py-3 bg-transparent font-display text-xl placeholder:text-slate/20 focus:border-forest outline-none transition-all"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-slate/40 uppercase tracking-widest mb-3 block">Contact Terminal</label>
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border-b border-slate/20 py-3 bg-transparent font-display text-xl placeholder:text-slate/20 focus:border-forest outline-none transition-all"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-slate/40 uppercase tracking-widest mb-3 block">Delivery Destination</label>
              <textarea
                placeholder="Address Details"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border-b border-slate/20 py-3 bg-transparent font-display text-xl placeholder:text-slate/20 focus:border-forest outline-none transition-all min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="group relative w-full bg-navy text-bone py-5 font-body uppercase text-xs tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-navy/20"
            >
              <span className="relative z-10">Confirm Order (COD)</span>
              <div className="absolute inset-0 bg-forest translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <p className="mt-4 font-mono text-[8px] text-center text-slate/40 uppercase tracking-[0.3em]">
              By confirming, you agree to our terms of legacy.
            </p>
          </div>
        </form>
      </MotionSection>
    </main>
  );
}
