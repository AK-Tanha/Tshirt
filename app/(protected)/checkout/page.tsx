'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MotionSection } from '@/components/MotionSection';
import { useCart } from '@/hooks/use-cart';
import { useCreateOrder } from '@/hooks/use-orders';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const createOrder = useCreateOrder();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant.price ?? item.product.basePrice) * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate(
      { address, phone },
      {
        onSuccess: (order) => {
          router.push(`/order/${order.id}`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <main className="max-w-xl mx-auto px-6 pb-16 md:pb-24">
        <p className="text-center py-24 text-muted">Loading checkout...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-6 pb-16 md:pb-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Your bag is empty</h1>
        <Link href="/products" className="underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 pb-16 md:pb-24">
      <MotionSection>
        <div className="mb-12 border-b border-border pb-8">
          <span className="font-mono text-muted uppercase tracking-widest text-[10px] mb-2 block">
            Checkout
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-black tracking-tight leading-none font-bold">
            Complete Order
          </h1>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-border pb-4">
              <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-stone shrink-0">
                <Image
                  src={item.product.images[0]?.url ?? '/placeholder.png'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted">
                  {item.variant.size} / {item.variant.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-mono text-sm">
                ৳{(Number(item.variant.price ?? item.product.basePrice) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <span className="font-mono text-xs text-muted uppercase tracking-widest">Subtotal</span>
            <span className="font-bold">৳{subtotal.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="font-body text-sm text-muted mb-2 block">Phone Number</label>
              <input
                type="tel"
                placeholder="+880 1XXX XXXXXXX"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border rounded-lg py-3 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-black outline-none transition-all"
              />
            </div>

            <div>
              <label className="font-body text-sm text-muted mb-2 block">Delivery Address</label>
              <textarea
                placeholder="Street, City, Area..."
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-border rounded-lg py-3 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-black outline-none transition-all min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full bg-black text-white py-4 rounded-lg font-body text-sm font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrder.isPending ? 'Placing order...' : 'Confirm Order (COD)'}
            </button>
            {createOrder.error && (
              <p className="mt-3 text-center text-sm text-red-500">{createOrder.error.message}</p>
            )}
            <p className="mt-4 font-body text-xs text-center text-muted">
              By confirming, you agree to our terms.
            </p>
          </div>
        </form>
      </MotionSection>
    </main>
  );
}
