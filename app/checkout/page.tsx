'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { MotionSection } from '@/components/MotionSection';

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // processOnlinePayment(); // Future SSLCommerz
    dispatch({ type: 'CLEAR_CART' });
    router.push('/order/123'); // Mock order ID
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12 md:py-24">
      <MotionSection>
        <h1 className="font-display text-4xl mb-10 text-navy tracking-[0.02em]">CHECKOUT</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Name" required className="w-full border border-slate p-3 bg-bone font-body" />
          <input type="tel" placeholder="Phone" required className="w-full border border-slate p-3 bg-bone font-body" />
          <textarea placeholder="Address" required className="w-full border border-slate p-3 bg-bone font-body" />
          <button type="submit" className="w-full bg-forest text-bone p-4 font-body uppercase tracking-[0.05em] hover:opacity-90">Confirm Order (Cash on Delivery)</button>
        </form>
      </MotionSection>
    </main>
  );
}
