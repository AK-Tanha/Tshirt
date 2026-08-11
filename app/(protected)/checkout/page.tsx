'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MotionSection } from '@/components/MotionSection';
import { useCart } from '@/context/CartContext';
import { useCreateGuestOrder } from '@/hooks/use-orders';
import { useAuthStore } from '@/stores/auth-store';
import { useOrderStore } from '@/stores/order-store';
import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const createOrder = useCreateGuestOrder();
  const setLastOrder = useOrderStore((s) => s.setLastOrder);
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name || '');
      setPhone((p) => p || user.phone || '');
      setAddress((a) => a || user.address || '');
    }
  }, [user]);

  const items = state.items;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate(
      {
        name,
        phone,
        address,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (order) => {
          dispatch({ type: 'CLEAR_CART' });
          setLastOrder(order);
          router.push(`/order/${order.id}`);
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <main className="px-page max-w-xl mx-auto py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4 text-ink">
          Your bag is empty
        </h1>
        <Link
          href="/products"
          className="inline-block bg-ink text-white px-8 py-4 rounded-full font-body text-sm font-medium"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="px-page max-w-xl mx-auto py-8 pt-10 md:py-16 pb-24">
      <MotionSection>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase tracking-[0.2em] hover:text-ink transition-colors mb-5"
        >
          <ChevronLeft className="w-3 h-3" /> Back to bag
        </Link>
        <div className="mb-10">
          <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
            Checkout
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-ink tracking-tight leading-none font-bold">
            Complete <em className="font-light italic">order</em>
          </h1>
          {!user && (
            <p className="mt-4 font-body text-sm text-muted">
              No account needed — just your delivery details.
            </p>
          )}
        </div>

        <div className="lg:hidden space-y-3 mb-8">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-3">
              <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-stone shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-[11px] text-muted">
                  {item.size} / {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-body text-sm">
                ৳{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-5">Delivery details</h2>
            <div className="space-y-5">
              <div>
                <label className="font-body text-sm text-muted mb-2 block">Full name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border rounded-xl py-3.5 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-ink outline-none transition-all"
                />
              </div>

              <div>
                <label className="font-body text-sm text-muted mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+880 1XXX XXXXXXX"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-border rounded-xl py-3.5 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-ink outline-none transition-all"
                />
              </div>

              <div>
                <label className="font-body text-sm text-muted mb-2 block">Delivery Address</label>
                <textarea
                  placeholder="House, Road, Area, City..."
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-border rounded-xl py-3.5 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-ink outline-none transition-all min-h-[90px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">
                  {items.length} item{items.length > 1 ? 's' : ''}
                </span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className="text-ink/70">On confirmation</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
              <span className="font-medium">Total (COD)</span>
              <span className="font-display text-2xl font-bold">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full bg-ink text-white py-4 rounded-full font-body text-sm font-semibold hover:bg-ink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              {createOrder.isPending ? 'Placing order...' : 'Confirm Order — Cash on Delivery'}
            </button>
            {createOrder.error && (
              <p className="mt-3 text-center text-sm text-red-500">
                {createOrder.error.message}
              </p>
            )}
            <p className="mt-4 font-body text-xs text-center text-muted">
              By confirming you agree to our terms. We’ll call to confirm delivery.
            </p>
          </div>
        </form>
      </MotionSection>
    </main>
  );
}
