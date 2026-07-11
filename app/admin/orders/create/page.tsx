'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { products, variants } from '@/lib/data';
import type { ProductVariant } from '@/lib/types';
import { Field, getInputClass } from '@/components/ui/Field';
import {
  Plus, Minus, Loader2, AlertCircle, ArrowLeft, Trash2, ShoppingCart,
} from 'lucide-react';

const TAX_RATE = 0.05;
const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
const variantsByProduct = variants.reduce((acc, v) => {
  (acc[v.productId] ??= []).push(v);
  return acc;
}, {} as Record<string, ProductVariant[]>);

export default function CreateOrderPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [discount, setDiscount] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [pendingQty, setPendingQty] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<Record<string, number>>({});

  const errors: Record<string, string> = {};
  if (!customerName.trim() && touched.name) errors.name = 'Customer name is required';
  if (!phone.trim() && touched.phone) errors.phone = 'Phone number is required';
  if (touched.products && Object.keys(cart).length === 0) errors.products = 'Add at least one product';

  const selectedProduct = selectedProductId ? productMap[selectedProductId] : null;
  const selectedVariants = selectedProductId ? (variantsByProduct[selectedProductId] ?? []) : [];

  const addToOrder = () => {
    const hasQty = Object.values(pendingQty).some((q) => q > 0);
    if (!selectedProductId || !hasQty) return;
    setCart((prev) => {
      const next = { ...prev };
      Object.entries(pendingQty).forEach(([vid, qty]) => {
        next[vid] = (next[vid] ?? 0) + qty;
      });
      return next;
    });
    setSelectedProductId('');
    setPendingQty({});
    setTouched((p) => ({ ...p, products: true }));
  };

  const updatePendingQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      const { [variantId]: _, ...rest } = pendingQty;
      setPendingQty(rest);
    } else {
      setPendingQty((prev) => ({ ...prev, [variantId]: qty }));
    }
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => {
      const { [variantId]: _, ...rest } = prev;
      return rest;
    });
  };

  const cartVariants = useMemo(() => {
    return Object.entries(cart).map(([vid, qty]) => {
      const v = variants.find((x) => x.id === vid);
      const p = v ? productMap[v.productId] : null;
      return { variantId: vid, productName: p?.name ?? '', size: v?.size ?? '', color: v?.color ?? '', qty, unitPrice: p?.price ?? 0 };
    });
  }, [cart]);

  const cartItems = useMemo(() => {
    const grouped = cartVariants.reduce((acc, cv) => {
      if (!acc[cv.productName]) {
        acc[cv.productName] = { productName: cv.productName, unitPrice: cv.unitPrice, variants: [], qty: 0 };
      }
      acc[cv.productName].variants.push(cv);
      acc[cv.productName].qty += cv.qty;
      return acc;
    }, {} as Record<string, { productName: string; unitPrice: number; variants: typeof cartVariants; qty: number }>);
    return Object.values(grouped);
  }, [cartVariants]);

  const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discountAmount = Math.min(discount, subtotal);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + tax;

  const valid = customerName.trim() && phone.trim() && Object.keys(cart).length > 0;

  const handleSubmit = () => {
    setTouched({ name: true, phone: true, products: true });
    if (!valid) return;
    setSubmitting(true);

    const items = Object.entries(
      Object.entries(cart).reduce((acc, [variantId, qty]) => {
        const v = variants.find((x) => x.id === variantId);
        if (!v) return acc;
        acc[v.productId] = (acc[v.productId] ?? 0) + qty;
        return acc;
      }, {} as Record<string, number>),
    ).map(([productId, quantity]) => ({ productId, quantity }));

    const orderId = `ord_${Date.now().toString(36)}`;
    const order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address || 'N/A',
      items,
      totalAmount: total,
      paymentMethod: 'cod',
      status: 'pending_confirmation' as const,
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
      deliveryDate: deliveryDate || undefined,
      discount: discountAmount > 0 ? discountAmount : undefined,
    };

    const existing = JSON.parse(sessionStorage.getItem('new_orders') || '[]');
    existing.unshift(order);
    sessionStorage.setItem('new_orders', JSON.stringify(existing));

    setTimeout(() => { router.push('/admin/orders'); }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

  const totalItemCount = cartVariants.reduce((s, cv) => s + cv.qty, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Create Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-border p-6" onKeyDown={handleKeyDown}>
            <h2 className="font-display text-base font-bold mb-4">Customer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Customer Name" required error={errors.name}>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    placeholder="Full name"
                    autoFocus
                    className={getInputClass(errors.name)}
                  />
                </Field>
              </div>
              <Field label="Phone" required error={errors.phone}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                  placeholder="017xxxxxxxx"
                  className={getInputClass(errors.phone)}
                />
              </Field>
              <Field label="Address">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery address"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 placeholder:text-muted/60"
                />
              </Field>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-display text-base font-bold mb-4">Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Product list */}
              <div className="md:col-span-7 border border-border rounded-lg overflow-hidden">
                <div className="max-h-[340px] overflow-y-auto divide-y divide-border/50">
                  {products.map((p) => {
                    const inCart = Object.entries(cart).some(([vid]) => variants.find((v) => v.id === vid)?.productId === p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProductId(p.id); setPendingQty({}); }}
                        className={cn(
                          "w-full text-left flex items-center justify-between px-4 py-2.5 transition-colors",
                          selectedProductId === p.id
                            ? "bg-black text-white"
                            : "hover:bg-stone/50 text-black",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium">{p.name}</span>
                          <span className="text-xs ml-2 opacity-60 capitalize">{p.category}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={cn("text-sm font-mono", selectedProductId === p.id ? "text-white/80" : "text-muted")}>
                            ৳{p.price.toLocaleString()}
                          </span>
                          {inCart && (
                            <span className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                              selectedProductId === p.id ? "bg-white/20 text-white" : "bg-black text-white",
                            )}>
                              Added
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variant picker */}
              <div className="md:col-span-5">
                {selectedProduct ? (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-stone/70">
                      <p className="text-sm font-semibold truncate">{selectedProduct.name}</p>
                      <p className="text-xs text-muted font-mono shrink-0">৳{selectedProduct.price.toLocaleString()}</p>
                    </div>
                    <div className="divide-y divide-border/50">
                      {selectedVariants.map((v) => {
                        const qty = pendingQty[v.id] ?? 0;
                        const outOfStock = v.stockQuantity === 0;
                        return (
                          <div key={v.id} className="flex items-center justify-between px-3 py-2 hover:bg-stone/30 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-medium w-10 shrink-0">{v.size}</span>
                              <span className="text-sm text-muted truncate">{v.color}</span>
                            </div>
                            {outOfStock ? (
                              <span className="text-[11px] text-red-400 font-medium shrink-0">Out</span>
                            ) : (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => updatePendingQty(v.id, qty - 1)}
                                  className="w-6 h-6 flex items-center justify-center border border-border rounded bg-white hover:bg-stone transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-mono font-semibold tabular-nums">{qty}</span>
                                <button
                                  onClick={() => updatePendingQty(v.id, qty + 1)}
                                  className="w-6 h-6 flex items-center justify-center border border-border rounded bg-white hover:bg-stone transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-3 py-2.5 border-t border-border">
                      <button
                        onClick={addToOrder}
                        disabled={Object.values(pendingQty).every((q) => q === 0)}
                        className={cn(
                          "w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          Object.values(pendingQty).some((q) => q > 0)
                            ? "bg-black text-white hover:bg-black/80"
                            : "bg-stone text-muted cursor-not-allowed",
                        )}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-lg h-full min-h-[120px] flex items-center justify-center p-6">
                    <p className="text-xs text-muted/60 text-center">Select a product to configure variants</p>
                  </div>
                )}
              </div>
            </div>

            {errors.products && (
              <p className="flex items-center gap-1 text-[11px] text-red-600 mt-3">
                <AlertCircle className="w-3 h-3" />
                {errors.products}
              </p>
            )}
          </div>

          {/* Notes & Delivery */}
          <div className="bg-white rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display text-base font-bold">Notes &amp; Schedule</h2>
            <Field label="Order Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes, special instructions..."
                rows={2}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 resize-none placeholder:text-muted/60"
              />
            </Field>
            <Field label="Delivery Date">
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
              />
            </Field>
          </div>
        </div>

        {/* Sidebar — Basket + Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-border p-6 space-y-4 lg:sticky lg:top-6">
            {/* Items added */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-base font-bold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Basket
                </h2>
                <span className="text-xs text-muted">
                  {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
                </span>
              </div>

              {cartItems.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.productName} className="bg-stone/40 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <span className="text-xs font-mono tabular-nums">৳{(item.unitPrice * item.qty).toLocaleString()}</span>
                      </div>
                      {item.variants.map((cv) => (
                        <div key={cv.variantId} className="flex items-center justify-between pl-2">
                          <span className="text-xs text-muted">{cv.size} / {cv.color} &times; {cv.qty}</span>
                          <button
                            onClick={() => removeFromCart(cv.variantId)}
                            className="p-0.5 hover:bg-white rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-muted hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-2">
                  <ShoppingCart className="w-8 h-8 text-muted/20 mx-auto mb-2" />
                  <p className="text-xs text-muted/50">Basket is empty</p>
                </div>
              )}
            </div>

            {/* Totals */}
            {cartItems.length > 0 && (
              <div className="space-y-2 text-sm pt-4 border-t border-border">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted shrink-0">Discount</span>
                  <div className="flex items-center gap-1">
                    <span className="text-muted text-xs">৳</span>
                    <input
                      type="number"
                      value={discount || ''}
                      onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      min={0}
                      max={subtotal}
                      className="w-16 text-right px-1.5 py-1 border border-border rounded text-sm font-mono outline-none focus:border-black transition-colors tabular-nums"
                    />
                    {discountAmount > 0 && (
                      <button onClick={() => setDiscount(0)} className="p-0.5 hover:bg-stone rounded">
                        <Trash2 className="w-3 h-3 text-muted" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Tax (5%)</span>
                  <span className="font-mono tabular-nums">৳{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="tabular-nums">৳{total.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  valid && !submitting
                    ? "bg-black text-white hover:bg-black/80 shadow-sm"
                    : "bg-stone text-muted cursor-not-allowed",
                )}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Order
              </button>
              <button
                onClick={() => router.back()}
                className="w-full px-4 py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-stone transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
