'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePurchaseOrder } from '@/hooks/use-purchase-orders';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useProducts } from '@/hooks/use-products';
import { useToast } from '@/components/ui/Toast';
import { Field } from '@/components/ui/Field';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import type { ProductVariant } from '@/lib/types';

interface LineItem {
  id: string;
  variantId: string;
  quantity: string;
  unitCost: string;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createPO = useCreatePurchaseOrder();
  const { data: suppliers = [] } = useSuppliers();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 1000 });

  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), variantId: '', quantity: '1', unitCost: '' },
  ]);

  const allVariants = (productsData?.data ?? []).flatMap((p) =>
    p.variants.map((v) => ({ ...v, productName: p.name })),
  );

  const activeSuppliers = suppliers.filter((s) => s.isActive);

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), variantId: '', quantity: '1', unitCost: '' }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const validItems = items.filter((it) => it.variantId && Number(it.quantity) > 0 && Number(it.unitCost) >= 0);
  const total = validItems.reduce((sum, it) => {
    const v = allVariants.find((x) => x.id === it.variantId);
    return sum + Number(it.unitCost) * Number(it.quantity);
  }, 0);

  const valid = supplierId && validItems.length > 0;

  const handleSubmit = () => {
    if (!valid) {
      toast('Select a supplier and add at least one valid line item', 'error');
      return;
    }
    createPO.mutate(
      {
        supplierId,
        notes: notes.trim() || undefined,
        items: validItems.map((it) => ({
          variantId: it.variantId,
          quantity: Number(it.quantity),
          unitCost: Number(it.unitCost),
        })),
      },
      {
        onSuccess: (po) => {
          toast(`PO #${po.id.slice(0, 8)} created`);
          router.push('/admin/inventory/purchase-orders');
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
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">New Purchase Order</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Order stock from a supplier</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Supplier" required>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
            >
              <option value="">Select a supplier...</option>
              {activeSuppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Restock for July collection"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-muted uppercase tracking-wider font-medium">
              Line Items <span className="text-red-500">*</span>
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
                            {v.productName} · {v.size} / {v.color} (stock {v.stock})
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
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Unit Cost (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={item.unitCost}
                      onChange={(e) => updateItem(item.id, { unitCost: e.target.value })}
                      placeholder="350"
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-1 flex sm:justify-end">
                    {selected && (
                      <span className="text-xs text-neutral-500 font-mono whitespace-nowrap">
                        ৳{(Number(item.unitCost || 0) * Number(item.quantity || 0)).toLocaleString()}
                      </span>
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
          <span className="text-sm text-neutral-500">Estimated total</span>
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
          disabled={!valid || createPO.isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createPO.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Purchase Order
        </button>
      </div>
    </div>
  );
}