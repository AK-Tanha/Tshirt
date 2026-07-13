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
 <div className="mb-12 border-b border-border pb-8">
 <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">Checkout</span>
 <h1 className="font-display text-5xl md:text-7xl text-black tracking-tight leading-none font-bold">Complete Order</h1>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-6">
 <div>
 <label className="font-body text-sm text-muted mb-2 block">Full Name</label>
 <input
 type="text"
 placeholder="John Doe"
 required
 value={name}
 onChange={e => setName(e.target.value)}
 className="w-full border border-border rounded-lg py-3 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-black outline-none transition-all"
 />
 </div>

 <div>
 <label className="font-body text-sm text-muted mb-2 block">Phone Number</label>
 <input
 type="tel"
 placeholder="+880 1XXX XXXXXXX"
 required
 value={phone}
 onChange={e => setPhone(e.target.value)}
 className="w-full border border-border rounded-lg py-3 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-black outline-none transition-all"
 />
 </div>

 <div>
 <label className="font-body text-sm text-muted mb-2 block">Delivery Address</label>
 <textarea
 placeholder="Street, City, Area..."
 required
 value={address}
 onChange={e => setAddress(e.target.value)}
 className="w-full border border-border rounded-lg py-3 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-black outline-none transition-all min-h-[80px] resize-none"
 />
 </div>
 </div>

 <div className="pt-4">
 <button
 type="submit"
 className="w-full bg-black text-white py-4 rounded-lg font-body text-sm font-medium hover:bg-black/90 transition-all"
 >
 Confirm Order (COD)
 </button>
 <p className="mt-4 font-body text-xs text-center text-muted">
 By confirming, you agree to our terms.
 </p>
 </div>
 </form>
 </MotionSection>
 </main>
 );
}
