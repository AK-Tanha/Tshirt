'use client';

import { Fragment, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/use-products';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useStockMovements, useAdjustStock } from '@/hooks/use-stock-movements';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import type { StockMovement, StockMovementType } from '@/lib/types';
import {
  Search,
  Package,
  AlertTriangle,
  X,
  CheckCircle,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  History,
  SlidersHorizontal,
  Loader2,
  Info,
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
  movements: StockMovement[];
}

const TYPE_META: Record<StockMovementType, { label: string; cls: string }> = {
  PURCHASE_IN: { label: 'Purchase', cls: 'bg-emerald-50 text-emerald-700' },
  SALE_OUT: { label: 'Sale', cls: 'bg-amber-50 text-amber-700' },
  ADJUSTMENT: { label: 'Adjustment', cls: 'bg-blue-50 text-blue-700' },
  RETURN_IN: { label: 'Return', cls: 'bg-violet-50 text-violet-700' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminInventory() {
  const { data: productsData, isLoading: loadingProducts } = useProducts({
    limit: 100,
  });
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers();
  const { data: movementsData, isLoading: loadingMovements } = useStockMovements({
    limit: 200,
  });
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [adjustFor, setAdjustFor] = useState<FlatVariant | null>(null);

  const supplierMap = useMemo(
    () => Object.fromEntries(suppliers.map((s) => [s.id, s])),
    [suppliers],
  );

  const movementsByVariant = useMemo(() => {
    const map = new Map<string, StockMovement[]>();
    for (const m of movementsData?.data ?? []) {
      const arr = map.get(m.variantId);
      if (arr) arr.push(m);
      else map.set(m.variantId, [m]);
    }
    return map;
  }, [movementsData]);

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
          movements: movementsByVariant.get(v.id) ?? [],
        });
      }
    }
    return rows;
  }, [productsData, supplierMap, movementsByVariant]);

  const isLoading = loadingProducts || loadingSuppliers;

  const totalStock = items.reduce((a, b) => a + b.stock, 0);
  const lowStockItems = items.filter((i) => i.stock > 0 && i.stock <= 5).length;
  const outOfStockItems = items.filter((i) => i.stock === 0).length;
  const healthy = items.length - lowStockItems - outOfStockItems;
  const movementCount = movementsData?.data?.length ?? 0;

  const q = search.toLowerCase();
  const filtered = items.filter(
    (i) =>
      i.productName.toLowerCase().includes(q) ||
      i.size.toLowerCase().includes(q) ||
      i.color.toLowerCase().includes(q) ||
      (i.supplierName ?? '').toLowerCase().includes(q),
  );

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Inventory
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {items.length} variants across {productsData?.data.length ?? 0}{' '}
            products
          </p>
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

      <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 border border-border rounded-lg px-4 py-2.5">
        <Info className="w-3.5 h-3.5 shrink-0" />
        {loadingMovements
          ? 'Loading stock movements...'
          : `Every stock change is tracked with an in/out reason — ${movementCount} movements recorded (sales, purchase orders, returns & manual adjustments). Expand a row to see its history or use Adjust to record one.`}
      </div>

      <div className="relative min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by product name, size, color or supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-border rounded-lg text-sm truncate outline-none focus:border-black transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <Card className="p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Color</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden xl:table-cell">Last activity</th>
                <th className="p-4 font-medium hidden lg:table-cell">Supplier</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-neutral-500 text-sm">
                    Loading inventory...
                  </td>
                </tr>
              )}
              {filtered.map((i) => (
                <Fragment key={i.variantId}>
                  <tr className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => toggleExpanded(i.variantId)}
                        className="flex items-center gap-2 font-medium text-left group"
                      >
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-neutral-400 shrink-0 transition-transform',
                            expanded.has(i.variantId) && 'rotate-180',
                          )}
                        />
                        <span className="truncate max-w-[220px] group-hover:underline">
                          {i.productName}
                        </span>
                      </button>
                    </td>
                    <td className="p-4">{i.size}</td>
                    <td className="p-4">{i.color}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'font-mono text-sm',
                          i.stock === 0
                            ? 'text-red-600'
                            : i.stock <= 5
                              ? 'text-amber-600'
                              : 'text-black',
                        )}
                      >
                        {i.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <StockBadge qty={i.stock} />
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      {i.movements.length > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                          {i.movements[0].quantity >= 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                          )}
                          {timeAgo(i.movements[0].createdAt)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">
                          {i.supplierName ?? '—'}
                        </span>
                        {i.supplierName && (
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full shrink-0',
                              i.supplierActive ? 'bg-emerald-500' : 'bg-red-400',
                            )}
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleExpanded(i.variantId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-neutral-50 transition-colors"
                        >
                          <History className="w-3.5 h-3.5" /> History
                        </button>
                        <button
                          onClick={() => setAdjustFor(i)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded.has(i.variantId) && (
                    <tr className="bg-neutral-50/60 border-t border-border">
                      <td colSpan={8} className="px-6 py-5">
                        <MovementHistory
                          variant={i}
                          onAdjust={() => setAdjustFor(i)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-neutral-500 text-sm">
                    No inventory items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="md:hidden space-y-3">
        {isLoading && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            Loading inventory...
          </div>
        )}
        {filtered.map((i) => (
          <div
            key={i.variantId}
            className="bg-white rounded-xl border border-border p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button
                  onClick={() => toggleExpanded(i.variantId)}
                  className="flex items-center gap-1.5 font-medium text-left"
                >
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-neutral-400 shrink-0 transition-transform',
                      expanded.has(i.variantId) && 'rotate-180',
                    )}
                  />
                  <span className="truncate">{i.productName}</span>
                </button>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {i.size}
                  {i.color && <span> · {i.color}</span>}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={cn(
                    'font-mono text-sm font-medium',
                    i.stock === 0
                      ? 'text-red-600'
                      : i.stock <= 5
                        ? 'text-amber-600'
                        : 'text-black',
                  )}
                >
                  {i.stock}
                </p>
                <StockBadge qty={i.stock} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              <span className="text-xs text-neutral-500 truncate">
                {i.supplierName ?? '—'}
              </span>
              <button
                onClick={() => setAdjustFor(i)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust
              </button>
            </div>
            {expanded.has(i.variantId) && (
              <div className="border-t border-border/50 pt-3">
                <MovementHistory variant={i} onAdjust={() => setAdjustFor(i)} />
              </div>
            )}
          </div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            No inventory items found
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        Stock is adjusted automatically by sales, purchase-order receipts and
        order returns. Use Adjust stock to record manual changes with a reason.
      </p>

      <AnimatePresence>
        {adjustFor && (
          <AdjustStockModal
            variant={adjustFor}
            onClose={() => setAdjustFor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MovementHistory({
  variant,
  onAdjust,
}: {
  variant: FlatVariant;
  onAdjust: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium">Stock history</span>
          <span className="text-xs text-neutral-400">
            ({variant.movements.length})
          </span>
        </div>
        <button
          onClick={onAdjust}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-neutral-50 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust stock
        </button>
      </div>

      {variant.movements.length > 0 ? (
        <div>
          {variant.movements.slice(0, 8).map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
            >
              <span
                className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0',
                  TYPE_META[m.type].cls,
                )}
              >
                {TYPE_META[m.type].label}
              </span>
              <span
                className={cn(
                  'font-mono text-sm font-semibold w-16 shrink-0',
                  m.quantity >= 0 ? 'text-emerald-600' : 'text-red-600',
                )}
              >
                {m.quantity >= 0 ? `+${m.quantity}` : m.quantity}
              </span>
              <span className="flex-1 text-sm text-neutral-700 truncate">
                {m.reason ?? '—'}
              </span>
              <span className="text-xs text-neutral-400 shrink-0">
                {timeAgo(m.createdAt)}
              </span>
            </div>
          ))}
          {variant.movements.length > 8 && (
            <p className="text-xs text-neutral-400 pt-2">
              + {variant.movements.length - 8} more movements
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 py-2">
          No stock movements recorded yet for this variant.
        </p>
      )}
    </div>
  );
}

function AdjustStockModal({
  variant,
  onClose,
}: {
  variant: FlatVariant;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const adjust = useAdjustStock();
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const qty = parseInt(quantity, 10);
  const validQty = !isNaN(qty) && qty > 0;
  const delta = direction === 'in' ? qty : -qty;
  const result = variant.stock + (validQty ? delta : 0);
  const belowZero = validQty && result < 0;
  const canSubmit =
    validQty && reason.trim().length > 0 && !belowZero && !adjust.isPending;

  const submit = () => {
    if (!canSubmit) return;
    adjust.mutate(
      { variantId: variant.variantId, quantity: delta, reason: reason.trim() },
      {
        onSuccess: () => {
          toast(
            `Stock ${direction === 'in' ? 'increased' : 'decreased'} by ${qty} unit${qty === 1 ? '' : 's'}`,
          );
          onClose();
        },
        onError: (err) => toast(err.message, 'error'),
      },
    );
  };

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold tracking-tight">
              Adjust stock
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5 truncate">
              {variant.productName} · {variant.size}
              {variant.color && ` · ${variant.color}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-neutral-500 mb-2">
              Current stock:{' '}
              <span className="font-mono text-neutral-900">{variant.stock}</span>{' '}
              units
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('in')}
                className={cn(
                  'flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium transition-colors',
                  direction === 'in'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'border-border text-neutral-500 hover:bg-neutral-50',
                )}
              >
                <ArrowUpRight className="w-4 h-4" /> Increase
              </button>
              <button
                onClick={() => setDirection('out')}
                className={cn(
                  'flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium transition-colors',
                  direction === 'out'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'border-border text-neutral-500 hover:bg-neutral-50',
                )}
              >
                <ArrowDownRight className="w-4 h-4" /> Decrease
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-400"
            />
            {validQty && (
              <p className="text-xs text-neutral-500 mt-1.5">
                Resulting stock:{' '}
                <span
                  className={cn(
                    'font-mono font-medium',
                    result >= variant.stock ? 'text-emerald-600' : 'text-red-600',
                  )}
                >
                  {result}
                </span>{' '}
                units
              </p>
            )}
            {belowZero && (
              <p className="text-xs text-red-600 mt-1.5">
                Cannot decrease below 0 units.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damaged in warehouse, returned to supplier..."
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors resize-none placeholder:text-neutral-400"
            />
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adjust.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" />
            )}
            {adjust.isPending ? 'Applying...' : 'Apply adjustment'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
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
  if (qty === 0)
    return (
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  if (qty <= 5)
    return (
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
        Low Stock
      </span>
    );
  return (
    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
      In Stock
    </span>
  );
}