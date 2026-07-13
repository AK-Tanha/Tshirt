'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products as initialProducts, variants, suppliers } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
 Plus, Search, Edit3, Eye, Trash2, Filter,
 Download,
} from 'lucide-react';

const categoryLabels: Record<string, string> = { polo: 'Polo', tshirt: 'T-Shirt' };
const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s]));

const stockVariant: Record<string, 'success' | 'warning' | 'danger'> = {
 high: 'success',
 low: 'warning',
 out: 'danger',
};

function getStockInfo(productId: string): { label: string; variant: 'success' | 'warning' | 'danger'; total: number } {
 const productVariants = variants.filter((v) => v.productId === productId);
 const total = productVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
 if (total === 0) return { label: 'Out of Stock', variant: 'danger', total };
 if (total <= 10) return { label: 'Low Stock', variant: 'warning', total };
 return { label: 'In Stock', variant: 'success', total };
}

export default function AdminProducts() {
 const [products, setProducts] = useState<Product[]>([]);
 const [search, setSearch] = useState('');
 const [supplierFilter, setSupplierFilter] = useState<string>('all');
 const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
 const [selected, setSelected] = useState<Set<string>>(new Set());
 const { toast } = useToast();

 useEffect(() => {
 const stored = JSON.parse(sessionStorage.getItem('new_products') || '[]');
 setProducts([...stored, ...initialProducts]);
 sessionStorage.removeItem('new_products');
 }, []);

 const filtered = products.filter((p) => {
 const q = search.toLowerCase();
 const supplier = supplierMap[p.supplierId ?? ''];
 const matchesSearch =
 p.name.toLowerCase().includes(q) ||
 p.category.toLowerCase().includes(q) ||
 (supplier?.name.toLowerCase().includes(q) ?? false);
 const matchesSupplier = supplierFilter === 'all' || p.supplierId === supplierFilter;
 return matchesSearch && matchesSupplier;
 });

 const handleDelete = () => {
 if (!deletingProduct) return;
 setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
 toast(`"${deletingProduct.name}" deleted`, 'error');
 setDeletingProduct(null);
 };

 const toggleSelect = (id: string) => {
 setSelected((prev) => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id); else next.add(id);
 return next;
 });
 };

 const toggleAll = () => {
 if (selected.size === filtered.length) setSelected(new Set());
 else setSelected(new Set(filtered.map((p) => p.id)));
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
 <p className="text-sm text-neutral-500 mt-1">{products.length} products</p>
 </div>
 <Link
 href="/admin/products/create"
 className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
 >
 <Plus className="w-4 h-4" />
 <span className="hidden sm:inline">Add Product</span>
 </Link>
 </div>

 <Card>
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
 <input
 type="text"
 placeholder="Search products..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
 />
 </div>
 <select
 value={supplierFilter}
 onChange={(e) => setSupplierFilter(e.target.value)}
 className="px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
 >
 <option value="all">All Suppliers</option>
 {suppliers.map((s) => (
 <option key={s.id} value={s.id}>{s.name}</option>
 ))}
 </select>
 <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
 <Filter className="w-4 h-4" /> Filters
 </button>
 <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
 <Download className="w-4 h-4" /> Export
 </button>
 </div>

 {selected.size > 0 && (
 <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-lg text-sm">
 <span className="font-medium">{selected.size} selected</span>
 <button className="text-red-600 hover:text-red-700 font-medium">Delete Selected</button>
 <button className="text-neutral-500 hover:text-neutral-900 font-medium" onClick={() => setSelected(new Set())}>Clear</button>
 </div>
 )}
 </Card>

 <div className="bg-white rounded-xl border border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
 <th className="p-4 w-10">
 <input
 type="checkbox"
 checked={filtered.length > 0 && selected.size === filtered.length}
 onChange={toggleAll}
 className="rounded border-neutral-300 "
 />
 </th>
 <th className="p-4 font-medium">Product</th>
 <th className="p-4 font-medium hidden md:table-cell">SKU</th>
 <th className="p-4 font-medium hidden lg:table-cell">Category</th>
 <th className="p-4 font-medium hidden lg:table-cell">Supplier</th>
 <th className="p-4 font-medium">Stock</th>
 <th className="p-4 font-medium">Price</th>
 <th className="p-4 font-medium hidden sm:table-cell">Status</th>
 <th className="p-4 font-medium w-10"></th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((product) => {
 const stock = getStockInfo(product.id);
 const allVariants = variants.filter((v) => v.productId === product.id);
 const colors = [...new Set(allVariants.map((v) => v.color))];
 return (
 <tr key={product.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
 <td className="p-4">
 <input
 type="checkbox"
 checked={selected.has(product.id)}
 onChange={() => toggleSelect(product.id)}
 className="rounded border-neutral-300 "
 />
 </td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
 <Image src={product.heroImage} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
 </div>
 <div className="min-w-0">
 <Link href={`/admin/products/${product.id}`} className="font-medium truncate hover:text-neutral-600 transition-colors">
 {product.name}
 </Link>
 <p className="text-xs text-neutral-500 truncate">{product.description}</p>
 </div>
 </div>
 </td>
 <td className="p-4 font-mono text-xs text-neutral-500 hidden md:table-cell">
 {allVariants[0]?.sku ?? '—'}
 </td>
 <td className="p-4 hidden lg:table-cell">
 <Badge variant="neutral">{categoryLabels[product.category]}</Badge>
 </td>
 <td className="p-4 text-xs text-neutral-500 hidden lg:table-cell">
 {supplierMap[product.supplierId ?? '']?.name ?? '—'}
 </td>
 <td className="p-4">
 <Badge variant={stock.variant}>{stock.label} ({stock.total})</Badge>
 </td>
 <td className="p-4 font-mono font-medium">৳{product.price.toLocaleString()}</td>
 <td className="p-4 hidden sm:table-cell">
 <Badge variant="success">Active</Badge>
 </td>
 <td className="p-4">
 <div className="flex items-center gap-1">
 <Link
 href={`/admin/products/${product.id}`}
 className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
 >
 <Eye className="w-4 h-4" />
 </Link>
 <Link
 href={`/admin/products/${product.id}/edit`}
 className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
 >
 <Edit3 className="w-4 h-4" />
 </Link>
 <button
 onClick={() => setDeletingProduct(product)}
 className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 {filtered.length === 0 && (
 <tr>
 <td colSpan={9} className="p-12 text-center text-sm text-neutral-500">No products found</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className="flex items-center justify-between text-sm text-neutral-500">
 <span>Showing {filtered.length} of {products.length} products</span>
 <div className="flex items-center gap-2">
 <button className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition-colors disabled:opacity-40">Previous</button>
 <span className="px-2 font-medium">1</span>
 <button className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition-colors disabled:opacity-40">Next</button>
 </div>
 </div>

 <ConfirmDialog
 open={!!deletingProduct}
 title="Delete Product"
 message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
 confirmLabel="Delete"
 variant="danger"
 onConfirm={handleDelete}
 onCancel={() => setDeletingProduct(null)}
 />
 </div>
 );
}


