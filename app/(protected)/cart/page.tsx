"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/use-cart";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) return <p className="text-center py-24">Loading cart...</p>;

  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant.price ?? item.product.basePrice;
    return sum + Number(price) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/products" className="underline mt-4 inline-block">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
      <h1 className="font-display text-4xl font-bold mb-8">Your Bag</h1>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-border pb-6">
            <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone shrink-0">
              <Image
                src={item.product.images[0]?.url ?? "/placeholder.png"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-muted">
                {item.variant.size} / {item.variant.color}
              </p>
              <p className="font-semibold mt-1">
                ৳{Number(item.variant.price ?? item.product.basePrice).toLocaleString()}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })
                  }
                  className="p-1.5 border border-border rounded-md"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                  }
                  className="p-1.5 border border-border rounded-md"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="ml-4 text-muted hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <span className="font-mono text-sm text-muted uppercase tracking-widest">Subtotal</span>
        <span className="text-2xl font-bold">৳{subtotal.toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 w-full bg-black text-white py-4 rounded-xl font-medium text-center block"
      >
        Proceed to Checkout
      </Link>
    </main>
  );
}