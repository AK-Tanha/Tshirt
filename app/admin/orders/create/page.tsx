'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products, variants } from '@/lib/data';
import Image from 'next/image';
import { Plus, Minus, ArrowLeft, Search, Trash2, Edit2, Save, User, Phone, MapPin, Calendar, FileText, Tag, X } from 'lucide-react';

const TAX_RATE = 0.05;
const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

const categoryLabels: Record<string, string> = { polo: 'Polo', tshirt: 'T-Shirt' };

function getAvailableColors(productId: string): string[] {
  return [...new Set(variants.filter((v) => v.productId === productId).map((v) => v.color))];
}

function getAvailableSizes(productId: string, color: string): string[] {
  return variants.filter((v) => v.productId === productId && v.color === color).map((v) => v.size);
}

function getVariantStock(productId: string, color: string, size: string): number {
  const v = variants.find((x) => x.productId === productId && x.color === color && x.size === size);
  return v?.stockQuantity ?? 0;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Out of Stock</span>;
  if (stock <= 5) return <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Low Stock ({stock})</span>;
  return <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock ({stock})</span>;
}

function QuantityStepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-stone disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold font-mono tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-stone transition-all duration-200"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ColorSelector({ productId, value, onChange }: {
  productId: string; value: string; onChange: (v: string) => void;
}) {
  const colors = getAvailableColors(productId);
  if (colors.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c === value ? '' : c)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
            c === value
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white text-muted border-border hover:border-black hover:text-black",
          )}
          aria-pressed={c === value}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function SizeSelector({ productId, color, value, onChange }: {
  productId: string; color: string; value: string; onChange: (v: string) => void;
}) {
  const sizes = getAvailableSizes(productId, color);
  if (sizes.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s === value ? '' : s)}
          className={cn(
            "w-9 h-9 rounded-lg text-xs font-semibold border transition-all duration-200",
            s === value
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white text-muted border-border hover:border-black hover:text-black",
          )}
          aria-pressed={s === value}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function SearchDropdown({ search, onSearchChange, onSelect, selectedId }: {
  search: string; onSearchChange: (v: string) => void; onSelect: (id: string) => void; selectedId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products.slice(0, 20);
    return products
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 20);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = productMap[selectedId];

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-stone/50 px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-black">{selected.name}</span>
          <span className="text-xs text-muted font-mono">৳{selected.price.toLocaleString()}</span>
        </div>
        <button
          type="button"
          onClick={() => onSelect('')}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] font-medium text-muted hover:text-black hover:bg-stone transition-all duration-200"
        >
          <Edit2 className="w-3 h-3" />
          Change
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center rounded-xl border border-border bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-black/10 transition-all duration-200">
        <Search className="w-4 h-4 text-muted mr-2 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="w-full bg-transparent border-none outline-none text-sm text-black placeholder:text-muted/50"
          aria-label="Search product"
          role="combobox"
          aria-expanded={open}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden animate-in fade-in duration-150">
          {filtered.length > 0 ? (
            <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onSelect(p.id); onSearchChange(''); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone transition-colors duration-150"
                >
                  {p.heroImage && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-stone">
                      <Image src={p.heroImage} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-black truncate">{p.name}</span>
                    <span className="text-[11px] text-muted capitalize truncate">{categoryLabels[p.category] ?? p.category}</span>
                  </div>
                  <span className="text-sm font-mono text-muted shrink-0">৳{p.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted">No products found</div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductCard({ item, index, onUpdate, onRemove, canRemove }: {
  item: { productId: string; productSearch: string; quantity: number; color: string; size: string };
  index: number; onUpdate: (i: number, k: string, v: string | number) => void; onRemove: (i: number) => void; canRemove: boolean;
}) {
  const stock = item.productId && item.color && item.size
    ? getVariantStock(item.productId, item.color, item.size)
    : null;
  const outOfStock = stock !== null && stock === 0;
  const hasSelection = item.productId && item.color && item.size;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 space-y-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <SearchDropdown
            search={item.productSearch}
            onSearchChange={(v) => onUpdate(index, 'productSearch', v)}
            onSelect={(id) => { onUpdate(index, 'productId', id); onUpdate(index, 'color', ''); onUpdate(index, 'size', ''); }}
            selectedId={item.productId}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {item.productId && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider">Quantity</label>
            <QuantityStepper
              value={item.quantity}
              onChange={(v) => onUpdate(index, 'quantity', v)}
              min={1}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider">Color</label>
            <ColorSelector productId={item.productId} value={item.color} onChange={(v) => { onUpdate(index, 'color', v); onUpdate(index, 'size', ''); }} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider">Size</label>
            <SizeSelector productId={item.productId} color={item.color} value={item.size} onChange={(v) => onUpdate(index, 'size', v)} />
          </div>
        </div>
      )}

      {stock !== null && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <StockBadge stock={stock} />
          {outOfStock && (
            <span className="text-[11px] text-red-500 bg-red-50 px-2 py-1 rounded-md font-medium">
              Cannot order — out of stock
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CustomerCard({ name, phoneVal, addressVal, date, onNameChange, onPhoneChange, onAddressChange, onDateChange }: {
  name: string; phoneVal: string; addressVal: string; date: string;
  onNameChange: (v: string) => void; onPhoneChange: (v: string) => void; onAddressChange: (v: string) => void; onDateChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      <h2 className="font-display text-base font-semibold tracking-tight">Customer Information</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-muted mt-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1.5 block">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Full name"
              autoFocus
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 placeholder:text-muted/40"
            />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-muted mt-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1.5 block">Phone</label>
            <input
              type="tel"
              value={phoneVal}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="017xxxxxxxx"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 placeholder:text-muted/40"
            />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted mt-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1.5 block">Address</label>
            <input
              type="text"
              value={addressVal}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Delivery address"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 placeholder:text-muted/40"
            />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-muted mt-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1.5 block">Delivery Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesCard({ notes, onNotesChange }: { notes: string; onNotesChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
      <h2 className="font-display text-base font-semibold tracking-tight">Notes</h2>
      <div className="flex items-start gap-3">
        <FileText className="w-4 h-4 text-muted mt-3 shrink-0" />
        <div className="flex-1">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Internal notes, special instructions..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 resize-none placeholder:text-muted/40"
          />
        </div>
      </div>
    </div>
  );
}

function StickySummary({ items, subtotal, shippingCost, discount, discountAmount, tax, total, onDiscountChange }: {
  items: Array<{ productName: string; quantity: number; color: string; size: string; unitPrice: number }>;
  subtotal: number; shippingCost: number; discount: number; discountAmount: number; tax: number; total: number;
  onDiscountChange: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      <h2 className="font-display text-base font-semibold tracking-tight">Order Summary</h2>

      {items.length > 0 && (
        <div className="space-y-3 pb-4 border-b border-border">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="min-w-0 flex-1 pr-2">
                <span className="font-medium truncate block">{item.productName}</span>
                <span className="text-xs text-muted">
                  x{item.quantity}{item.color ? ` · ${item.color}` : ''}{item.size ? ` / ${item.size}` : ''}
                </span>
              </div>
              <span className="font-mono text-xs text-muted shrink-0">৳{(item.unitPrice * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="font-mono text-black tabular-nums">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span className="font-mono text-black tabular-nums">৳{shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-muted">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Discount
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted">৳</span>
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => onDiscountChange(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              min={0}
              max={subtotal}
              className="w-16 text-right px-1.5 py-1 border border-border rounded-lg text-sm font-mono outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 tabular-nums"
              aria-label="Discount amount"
            />
            {discountAmount > 0 && (
              <button onClick={() => onDiscountChange(0)} className="p-1 hover:bg-stone rounded transition-colors" type="button" aria-label="Clear discount">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax (5%)</span>
          <span className="font-mono text-black tabular-nums">৳{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-display text-xl font-bold tracking-tight pt-3 border-t border-border">
          <span>Total</span>
          <span className="tabular-nums">৳{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function FooterActions({ isSubmitting, isValid }: { isSubmitting: boolean; isValid: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
      <Link
        href="/admin/orders"
        className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-black hover:bg-stone transition-all duration-200"
      >
        Cancel
      </Link>
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? 'Creating...' : 'Create Order'}
      </button>
    </div>
  );
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(70);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<Array<{
    productId: string; productSearch: string; quantity: number; color: string; size: string;
  }>>([{ productId: '', productSearch: '', quantity: 1, color: '', size: '' }]);

  const updateItem = (index: number, key: string, val: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: val } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { productId: '', productSearch: '', quantity: 1, color: '', size: '' }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const cartItems = useMemo(() => {
    return items.filter((i) => i.productId && i.quantity > 0).map((i) => {
      const p = productMap[i.productId];
      return { ...i, productName: p?.name ?? '', unitPrice: p?.price ?? 0 };
    });
  }, [items]);

  const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discountAmount = Math.min(discount, subtotal);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + tax + shippingCost;

  const isValid = customerName.trim().length > 0 && cartItems.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerName.trim()) { setError('Customer name is required'); return; }
    if (!cartItems.length) { setError('Add at least one item'); return; }
    setIsSubmitting(true);

    const orderItems = cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    const orderId = `ord_${Date.now().toString(36)}`;
    const order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim() || 'N/A',
      address: address.trim() || 'N/A',
      items: orderItems,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 rounded-xl border border-border hover:bg-stone hover:border-black transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-muted" />
        </Link>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Create Order</h1>
          <p className="text-sm text-muted">Create a new order on behalf of a customer</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-6">
            <CustomerCard
              name={customerName}
              phoneVal={phone}
              addressVal={address}
              date={deliveryDate}
              onNameChange={setCustomerName}
              onPhoneChange={setPhone}
              onAddressChange={setAddress}
              onDateChange={setDeliveryDate}
            />

            {/* Products */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold tracking-tight">
                  Products
                  {cartItems.length > 0 && (
                    <span className="text-sm font-normal text-muted ml-2">({cartItems.length})</span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <ProductCard
                    key={index}
                    item={item}
                    index={index}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>
            </div>

            <NotesCard notes={notes} onNotesChange={setNotes} />
          </div>

          {/* Right column - Sticky Summary + Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <StickySummary
                items={cartItems}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discount={discount}
                discountAmount={discountAmount}
                tax={tax}
                total={total}
                onDiscountChange={setDiscount}
              />
              <FooterActions isSubmitting={isSubmitting} isValid={isValid} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
