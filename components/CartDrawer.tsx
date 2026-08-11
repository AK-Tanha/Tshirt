"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { Minus, Plus, Trash2, X, ArrowRight, ShoppingBag } from "lucide-react";

export const CartDrawer = () => {
  const router = useRouter();
  const open = useCartDrawerStore((s) => s.open);
  const setOpen = useCartDrawerStore((s) => s.setOpen);
  const { state, dispatch } = useCart();

  const items = state.items;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const goToCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
              <h2 className="font-display text-lg font-semibold text-ink">
                Your Bag{" "}
                <span className="text-sm text-muted font-normal">
                  ({items.length})
                </span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close bag"
                className="p-2 -mr-2 text-muted hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="w-10 h-10 text-ink/20 mb-4" />
                <p className="text-ink/70 font-medium mb-1">Your bag is empty</p>
                <p className="text-sm text-muted mb-6">Something good is waiting.</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/products");
                  }}
                  className="bg-ink text-white px-8 py-3.5 rounded-full font-body text-sm font-medium hover:bg-ink/90 transition-colors"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <Link
                        href={`/products/${item.productId}`}
                        onClick={() => setOpen(false)}
                        className="relative w-16 h-20 rounded-lg overflow-hidden bg-stone shrink-0"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-display font-semibold text-sm text-ink line-clamp-1">
                            {item.name}
                          </h3>
                          <button
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                payload: item.variantId,
                              })
                            }
                            aria-label="Remove item"
                            className="text-muted hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          {item.size} / {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "SET_QUANTITY",
                                  payload: {
                                    variantId: item.variantId,
                                    quantity: item.quantity - 1,
                                  },
                                })
                              }
                              className="p-1.5 hover:bg-stone transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "SET_QUANTITY",
                                  payload: {
                                    variantId: item.variantId,
                                    quantity: item.quantity + 1,
                                  },
                                })
                              }
                              className="p-1.5 hover:bg-stone transition-colors"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-semibold text-sm">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-4 shrink-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="font-display text-xl font-bold text-ink">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={goToCheckout}
                    className="w-full bg-ink text-white py-4 rounded-full font-body text-sm font-semibold flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center font-body text-[11px] text-muted">
                    Cash on delivery · We&apos;ll call to confirm
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
