'use client';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';
import Link from 'next/link';
import { MotionSection } from '@/components/MotionSection';

export default function CartPage() {
  const { state, dispatch } = useCart();
  
  const cartProducts = state.items.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  }));

  const subtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 md:py-24">
      <MotionSection>
        <h1 className="font-display text-4xl mb-12 text-navy tracking-[0.02em]">CART</h1>
        {cartProducts.length === 0 ? <p className="font-body text-slate">Cart is empty.</p> : (
          <>
            {cartProducts.map(item => (
              <div key={item.variantId} className="border-b border-slate py-6 flex justify-between items-center">
                <div>
                  <h3 className="font-display text-2xl text-navy">{item.product.name}</h3>
                  <p className="font-mono text-sm text-forest">৳{item.product.price}</p>
                </div>
                <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.variantId })} className="text-slate hover:text-forest">Remove</button>
              </div>
            ))}
            <div className="mt-10 font-display text-3xl text-right text-navy">Total: ৳{subtotal}</div>
            <Link href="/checkout" className="block w-full text-center bg-forest text-bone p-4 mt-6 font-body uppercase tracking-[0.05em] hover:opacity-90">Checkout</Link>
          </>
        )}
      </MotionSection>
    </main>
  );
}
