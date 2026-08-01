'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/use-products';
import { useSuppliers } from '@/hooks/use-suppliers';
import { Card } from '@/components/ui/Card';
import {
  Search, Package, AlertTriangle, X, CheckCircle,
} from 'lucide-react';

interface FlatVariant {
  variantId: string;
  productId: string;
  productName: string;
  supplierId: string | null;
  supplierName?: string;
  supplierActive?: boolean;
  size: string;
  color: string;
  stock: number;
}

export default function AdminInventory() {
  const { data: productsData, isLoading: loadingProducts } = useProducts({ limit: 100 });
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers();
  const [search, setSearch] = useState('');

  const supplierMap = useMemo(
    () => Object.fromEntries(suppliers.map((s) => [s.id, s])),
    [suppliers],
  );

  const items: FlatVariant[] = useMemo(() => {
    const rows: FlatVariant[] = [];
    for (const p of productsData?.data ?? []) {
      for (const v of p.variants ?? []) {
        const sup = p.supplierId ? supplierMap[p.supplierId] : undefined;
        rows.push({
          variantId: v.id,
          productId: p.id,
          productName: p.name,
          supplierId: p.supplierId,
          supplierName: sup?.name,
          supplierActive: sup?.isActive,
          size: v.size,
          color: v.color,
          stock: v.stock,
        });
      }
    }
    return rows;
  }, [productsData, supplierMap]);

  const isLoading = loadingProducts || loadingSuppliers;

  const totalStock = items.reduce((a, b) => a + b.stock, 0);
  const lowStockItems = items.filter((i) => i.stock > 0 && i.stock <= 5).length;
  const outOfStockItems = items.filter((i) => i.stock === 0).length;
  const healthy = items.length - lowStockItems - outOfStockItems;

  const q = search.toLowerCase();
  const filtered = items.filter((i) =>
    i.productName.toLowerCase().includes(q) ||
    i.size.toLowerCase().includes(q) ||
    i.color.toLowerCase().includes(q) ||
    (i.supplierName ?? '').toLowerCase().includes(q),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-1">{items.length} variants across {productsData?.data.length ?? 0} products</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          subtitle="units across all variants"
          icon={Package}
          color="bg-black text-white"
        />
        <SummaryCard
          title="Low Stock"
          value={lowStockItems.toString()}
          subtitle="variants with ≤5 units"
          icon={AlertTriangle}
          color="bg-amber-100 text-amber-700"
        />
        <SummaryCard
          title="Out of Stock"
          value={outOfStockItems.toString()}
          subtitle="variants with 0 units"
          icon={X}
          color="bg-red-100 text-red-700"
        />
        <SummaryCard
          title="Healthy Stock"
          value={healthy.toString()}
          subtitle="well-stocked variants"
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by product name, size, color or supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Color</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden lg:table-cell">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500 text-sm">Loading inventory...</td>
                </tr>
              )}
              {filtered.map((i) => (
                <tr key={i.variantId} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                  <td className="p-4 font-medium">{i.productName}</td>
                  <td className="p-4">{i.size}</td>
                  <td className="p-4">{i.color}</td>
                  <td className="p-4">
                    <span className={cn(
                      'font-mono text-sm',
                      i.stock === 0 ? 'text-red-600' : i.stock <= 5 ? 'text-amber-600' : 'text-black',
                    )}>
                      {i.stock}
                    </span>
                  </td>
                  <td className="p-4"><StockBadge qty={i.stock} /></td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">{i.supplierName ?? '—'}</span>
                      {i.supplierName && (
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full shrink-0',
                          i.supplierActive ? 'bg-emerald-500' : 'bg-red-400',
                        )} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500 text-sm">No inventory items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-neutral-400">
        Stock levels are read from product variants. To adjust stock, edit a product&apos;s variants.
      </p>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string; subtitle: string; icon: React.ElementType; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border p-4 md:p-5"
    >
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', color)}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
      <p className="text-[10px] text-neutral-500/60 mt-0.5">{subtitle}</p>
    </motion.div>
  );
}

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>;
  if (qty <= 5) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Low Stock</span>;
  return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">In Stock</span>;
}
