'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCreateAdminOrder } from '@/hooks/use-orders';
import { useCustomers } from '@/hooks/use-customers';
import { useProducts } from '@/hooks/use-products';
import { useToast } from '@/components/ui/Toast';
import { Field } from '@/components/ui/Field';
import { ArrowLeft, Plus, Trash2, Loader2, Check, UserRound, UserPlus, Phone } from 'lucide-react';
import type { Customer } from '@/lib/types';

interface LineItem {
  id: string;
  variantId: string;
  quantity: string;
}

type CustomerMode = 'existing' | 'new';

const inputClass =
  'w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10';

export default function CreateOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createOrder = useCreateAdminOrder();
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 1000 });

  const [mode, setMode] = useState<CustomerMode>('existing');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), variantId: '', quantity: '1' },
  ]);

  const allVariants = useMemo(
    () =>
      (productsData?.data ?? []).flatMap((p) =>
        p.variants.map((v) => ({ ...v, productName: p.name, basePrice: p.basePrice })),
      ),
    [productsData],
  );

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    const list = q
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
        )
      : customers;
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, customerSearch]);

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), variantId: '', quantity: '1' }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const pickCustomer = (customer: Customer) => {
    setCustomerId(customer.id);
    setCustomerSearch('');
    setCustomerDropdownOpen(false);
    setName(customer.name);
    setPhone(customer.phone);
    setAddress(customer.address ?? '');
  };

  const switchMode = (m: CustomerMode) => {
    setMode(m);
    if (m === 'new') {
      setCustomerId('');
    } else {
      setCustomerSearch('');
    }
  };

  const unitPrice = (variantId: string) => {
    const v = allVariants.find((x) => x.id === variantId);
    return v ? Number(v.price ?? v.basePrice) : 0;
  };

  const validItems = items.filter((it) => it.variantId && Number(it.quantity) > 0);
  const total = validItems.reduce((sum, it) => sum + unitPrice(it.variantId) * Number(it.quantity), 0);

  const valid =
    (mode === 'existing' ? !!customerId : true) &&
    name.trim() &&
    phone.trim() &&
    address.trim() &&
    validItems.length > 0;

  const handleSubmit = () => {
    if (!valid) {
      toast(
        mode === 'existing'
          ? 'Select a customer and add at least one valid line item'
          : 'Fill in the customer details and add at least one valid line item',
        'error',
      );
      return;
    }
    createOrder.mutate(
      {
        ...(mode === 'existing' && customerId ? { customerId } : {}),
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: validItems.map((it) => ({
          variantId: it.variantId,
          quantity: Number(it.quantity),
        })),
      },
      {
        onSuccess: (order) => {
          toast(`Order #${order.id.slice(0, 8)} created`);
          router.push(`/admin/orders/${order.id}`);
        },
        onError: (err) => toast(err.message, 'error'),
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Create Order</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Place an order on behalf of a customer</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-muted uppercase tracking-wider font-medium">
              Customer <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => switchMode('existing')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                mode === 'existing' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900',
              )}
            >
              <UserRound className="w-4 h-4" /> Existing Customer
            </button>
            <button
              type="button"
              onClick={() => switchMode('new')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                mode === 'new' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900',
              )}
            >
              <UserPlus className="w-4 h-4" /> New Customer
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setCustomerDropdownOpen(true);
                    }}
                    onFocus={() => setCustomerDropdownOpen(true)}
                    placeholder={selectedCustomer ? selectedCustomer.name : 'Search customers by name or phone...'}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
                  />
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerId('');
                        setCustomerSearch('');
                        setName('');
                        setPhone('');
                        setAddress('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {customerDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setCustomerDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto py-1">
                      {customersLoading && (
                        <div className="px-4 py-3 text-sm text-neutral-500">Loading customers...</div>
                      )}
                      {!customersLoading && filteredCustomers.length === 0 && (
                        <div className="px-4 py-3 text-sm text-neutral-500">No customers found</div>
                      )}
                      {filteredCustomers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickCustomer(c)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-neutral-100 transition-colors',
                            c.id === customerId && 'text-neutral-900 font-medium bg-neutral-50',
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{c.name}</p>
                            <p className="text-xs text-neutral-500 font-mono">{c.phone}</p>
                          </div>
                          {c.id === customerId && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {!selectedCustomer && (
                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  Tip: the customer is linked to the order via their phone number.
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 mb-4">
              A new account will be created automatically when the order is placed. If the phone is
              already registered, the order is attached to that existing customer instead.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahim Uddin"
                className={inputClass}
              />
            </Field>
            <Field label="Phone" required>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Delivery Address" required>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                rows={2}
                className={cn(inputClass, 'resize-none')}
              />
            </Field>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-muted uppercase tracking-wider font-medium">
              Items <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const selected = allVariants.find((v) => v.id === item.variantId);
              return (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border border-border rounded-lg p-3">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Product / Variant</label>
                    {productsLoading ? (
                      <div className="h-[42px] flex items-center px-3 text-sm text-neutral-400">Loading variants...</div>
                    ) : (
                      <select
                        value={item.variantId}
                        onChange={(e) => updateItem(item.id, { variantId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                      >
                        <option value="">Select variant...</option>
                        {allVariants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.productName} · {v.size} / {v.color} · ৳{unitPrice(v.id).toLocaleString()} (stock {v.stock})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Line Total</label>
                    <div className="h-[42px] flex items-center px-3 text-sm font-mono bg-neutral-50 border border-border rounded-lg">
                      {selected ? `৳${(unitPrice(item.variantId) * Number(item.quantity || 0)).toLocaleString()}` : '—'}
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-1 flex justify-end">
                    {selected && item.variantId && selected.stock < Number(item.quantity) && (
                      <span className="text-[10px] text-red-600 mr-2 self-center">Only {selected.stock} left</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-30"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 rounded-lg">
          <span className="text-sm text-neutral-500">Total</span>
          <span className="font-display text-lg font-bold">৳{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!valid || createOrder.isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createOrder.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Place Order
        </button>
      </div>
    </div>
  );
}