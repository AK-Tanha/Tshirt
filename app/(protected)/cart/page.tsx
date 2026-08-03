"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/use-cart";
import { getHeroImage } from "@/lib/utils";
import { Minus, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-muted animate-pulse">Loading cart...</p>
      </div>
    );

  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant.price ?? item.product.basePrice;
    return sum + Number(price) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="px-page max-w-4xl mx-auto py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-ink font-bold mb-4">
          Your bag is <em className="font-light italic">empty</em>
        </h1>
        <p className="text-muted mb-8">Let’s fix that — something good is waiting.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-ink text-white px-8 py-4 rounded-full font-body text-sm font-medium"
        >
          Start shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="px-page max-w-5xl mx-auto py-8 pt-10 md:py-16 pb-32">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-ink mb-10 leading-none">
          Your Bag <span className="text-lg md:text-2xl text-muted font-normal">({items.length})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-border rounded-2xl p-3 md:p-4 bg-white"
              >
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden bg-stone shrink-0"
                >
                  <Image
                    src={getHeroImage(item.product.images)?.url ?? "/placeholder.png"}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-display font-semibold text-sm md:text-base text-ink line-clamp-1">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="text-muted hover:text-red-500 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-muted mt-0.5">
                    Size {item.variant.size} / {item.variant.color}
                  </p>
                  <div className="flex items-end justify-between mt-3 gap-3">
                    <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="p-2.5 hover:bg-stone transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem.mutate({
                            itemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="p-2.5 hover:bg-stone transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-semibold text-sm md:text-base shrink-0">
                      ৳
                      {Number(
                        item.variant.price ?? item.product.basePrice,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary (desktop) */}
          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 bg-white border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-5">Order summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-display text-2xl font-bold">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 w-full bg-ink text-white py-4 rounded-full font-medium text-center block hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="mt-3 w-full text-center text-sm text-muted hover:text-ink transition-colors block"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-border px-page py-3 z-40 safe-area-bottom">
        <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
          <div>
            <span className="font-body text-[10px] text-muted uppercase tracking-widest block">
              Subtotal
            </span>
            <span className="font-display text-lg font-bold">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>
          <Link
            href="/checkout"
            className="flex-1 bg-ink text-white py-3.5 rounded-full font-body text-sm font-semibold text-center flex items-center justify-center gap-2 max-w-[220px]"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}