'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { products, variants, suppliers } from '@/lib/data';
import type { ProductVariant } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import {
 Search, Package, AlertTriangle, X, Plus, Minus, Save,
} from 'lucide-react';

const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s]));

export default function AdminInventory() {
 const [search, setSearch] = useState('');
 const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
 const [editQty, setEditQty] = useState(0);
 const [stock, setStock] = useState<Record<string, number>>(
 Object.fromEntries(variants.map((v) => [v.id, v.stockQuantity])),
 );
 const { toast } = useToast();

 const totalStock = Object.values(stock).reduce((a, b) => a + b, 0);
 const lowStockItems = variants.filter((v) => stock[v.id] > 0 && stock[v.id] <= 5).length;
 const outOfStockItems = variants.filter((v) => stock[v.id] === 0).length;

 const filtered = variants.filter((v) => {
 const product = productMap[v.productId];
 if (!product) return false;
 const q = search.toLowerCase();
 const supplier = supplierMap[product.supplierId ?? ''];
 return (
 product.name.toLowerCase().includes(q) ||
 v.sku.toLowerCase().includes(q) ||
 v.color.toLowerCase().includes(q) ||
 v.size.toLowerCase().includes(q) ||
 (supplier?.name.toLowerCase().includes(q) ?? false)
 );
 });

 const openEditor = (v: ProductVariant) => {
 setEditingVariant(v);
 setEditQty(stock[v.id]);
 };

 const saveStock = () => {
 if (!editingVariant) return;
 setStock((prev) => ({ ...prev, [editingVariant.id]: Math.max(0, editQty) }));
 const product = productMap[editingVariant.productId];
 toast(`Stock updated for ${product?.name ?? editingVariant.sku} — ${editQty} units`, 'success');
 setEditingVariant(null);
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Inventory</h1>
 <span className="text-xs text-muted font-mono">{variants.length} variants</span>
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
 subtitle="variants with &le;5 units"
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
 value={(variants.length - lowStockItems - outOfStockItems).toString()}
 subtitle="well-stocked variants"
 icon={Package}
 color="bg-emerald-100 text-emerald-700"
 />
 </div>

 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
 <input
 type="text"
 placeholder="Search by product name, SKU, size or color..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
 />
 </div>

 <div className="hidden lg:block bg-white rounded-xl border border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="text-left text-xs text-muted uppercase tracking-wider bg-stone/50">
 <th className="p-4 font-medium">Product</th>
 <th className="p-4 font-medium">SKU</th>
 <th className="p-4 font-medium">Size</th>
 <th className="p-4 font-medium">Color</th>
 <th className="p-4 font-medium">Stock</th>
 <th className="p-4 font-medium">Status</th>
 <th className="p-4 font-medium">Supplier</th>
 <th className="p-4 font-medium w-10"></th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((v) => {
 const product = productMap[v.productId];
 const supplier = product ? supplierMap[product.supplierId ?? ''] : undefined;
 const qty = stock[v.id];
 return (
 <tr key={v.id} className="border-t border-border text-sm hover:bg-stone/30 transition-colors">
 <td className="p-4 font-medium">{product?.name ?? v.productId}</td>
 <td className="p-4 font-mono text-xs text-muted">{v.sku}</td>
 <td className="p-4">{v.size}</td>
 <td className="p-4">{v.color}</td>
 <td className="p-4">
 <span className={cn(
 "font-mono text-sm",
 qty === 0 ? "text-red-600" : qty <= 5 ? "text-amber-600" : "text-black",
 )}>
 {qty}
 </span>
 </td>
 <td className="p-4">
 <StockBadge qty={qty} />
 </td>
 <td className="p-4">
 <div className="flex items-center gap-2">
 <span className="text-xs text-muted">{supplier?.name ?? '—'}</span>
 {supplier && (
 <span className={cn(
 "w-1.5 h-1.5 rounded-full shrink-0",
 supplier.status === 'active' ? "bg-emerald-500" : "bg-red-400",
 )} />
 )}
 </div>
 </td>
 <td className="p-4">
 <button
 onClick={() => openEditor(v)}
 className="text-muted hover:text-black transition-colors text-xs font-medium"
 >
 Edit
 </button>
 </td>
 </tr>
 );
 })}
 {filtered.length === 0 && (
 <tr>
 <td colSpan={8} className="p-12 text-center text-muted text-sm">No inventory items found</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className="lg:hidden space-y-3">
 {filtered.map((v) => {
 const product = productMap[v.productId];
 const supplier = product ? supplierMap[product.supplierId ?? ''] : undefined;
 const qty = stock[v.id];
 return (
 <div key={v.id} className="bg-white rounded-xl border border-border p-4 space-y-3">
 <div className="flex items-start justify-between">
 <div>
 <p className="text-sm font-medium">{product?.name ?? v.productId}</p>
 <p className="text-xs text-muted font-mono mt-0.5">{v.sku}</p>
 </div>
 <StockBadge qty={qty} />
 </div>
 <div className="flex items-center gap-4 text-sm">
 <span className="text-muted">Size: <span className="text-black font-medium">{v.size}</span></span>
 <span className="text-muted">Color: <span className="text-black font-medium">{v.color}</span></span>
 </div>
 {supplier && (
 <div className="text-xs text-muted flex items-center gap-1.5">
 Supplier: <span className="text-black font-medium">{supplier.name}</span>
 <span className={cn(
 "w-1.5 h-1.5 rounded-full",
 supplier.status === 'active' ? "bg-emerald-500" : "bg-red-400",
 )} />
 </div>
 )}
 <div className="flex items-center justify-between">
 <span className={cn(
 "font-mono text-lg font-bold",
 qty === 0 ? "text-red-600" : qty <= 5 ? "text-amber-600" : "text-black",
 )}>
 {qty}
 </span>
 <button
 onClick={() => openEditor(v)}
 className="px-4 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-stone transition-colors"
 >
 Update Stock
 </button>
 </div>
 </div>
 );
 })}
 {filtered.length === 0 && (
 <div className="bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">No inventory items found</div>
 )}
 </div>

 <AnimatePresence>
 {editingVariant && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
 onClick={() => setEditingVariant(null)}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 onClick={(e) => e.stopPropagation()}
 className="bg-white rounded-xl border border-border w-full max-w-sm"
 >
 <div className="flex items-center justify-between p-6 border-b border-border">
 <h2 className="font-display text-lg font-bold">Update Stock</h2>
 <button onClick={() => setEditingVariant(null)} className="p-2 hover:bg-stone rounded-lg transition-colors">
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="p-6 space-y-4">
 <div className="bg-stone rounded-lg p-4 space-y-1">
 <p className="text-sm font-medium">{productMap[editingVariant.productId]?.name}</p>
 <p className="text-xs text-muted font-mono">{editingVariant.sku}</p>
 <div className="flex gap-3 text-xs text-muted mt-2">
 <span>Size: {editingVariant.size}</span>
 <span>Color: {editingVariant.color}</span>
 </div>
 </div>

 <div>
 <label className="text-xs text-muted uppercase tracking-wider font-medium mb-2 block">Stock Quantity</label>
 <div className="flex items-center gap-3">
 <button
 onClick={() => setEditQty(Math.max(0, editQty - 1))}
 className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-stone transition-colors"
 >
 <Minus className="w-4 h-4" />
 </button>
 <input
 type="number"
 value={editQty}
 onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
 className="flex-1 text-center px-4 py-2.5 bg-white border border-border rounded-lg text-sm font-mono font-bold outline-none focus:border-black transition-colors"
 />
 <button
 onClick={() => setEditQty(editQty + 1)}
 className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-stone transition-colors"
 >
 <Plus className="w-4 h-4" />
 </button>
 </div>
 </div>

 <button
 onClick={saveStock}
 className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
 >
 <Save className="w-4 h-4" />
 Save Changes
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
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
 <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", color)}>
 <Icon className="w-4 h-4" />
 </div>
 <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{value}</p>
 <p className="text-xs text-muted mt-0.5">{title}</p>
 <p className="text-[10px] text-muted/60 mt-0.5">{subtitle}</p>
 </motion.div>
 );
}

function StockBadge({ qty }: { qty: number }) {
 if (qty === 0) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>;
 if (qty <= 5) return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Low Stock</span>;
 return <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">In Stock</span>;
}
