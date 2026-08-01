'use client';

import { useState } from 'react';
import type { ElementType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSuppliers } from '@/hooks/use-suppliers';
import type { Supplier } from '@/lib/types';
import {
 Search, Building2, Plus, X, Mail, Phone, MapPin,
 Package, Calendar, CheckCircle, XCircle,
} from 'lucide-react';

export default function AdminSuppliers() {
 const { data: suppliers = [], isLoading } = useSuppliers();
 const [search, setSearch] = useState('');
 const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

 const filtered = suppliers.filter((s) => {
 const q = search.toLowerCase();
 return (
 s.name.toLowerCase().includes(q) ||
 s.phone.toLowerCase().includes(q) ||
 (s.email ?? '').toLowerCase().includes(q)
 );
 });

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Suppliers</h1>
 <Link
 href="/admin/suppliers/create"
 className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
 >
 <Plus className="w-4 h-4" />
 <span className="hidden sm:inline">Add Supplier</span>
 </Link>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <SupplierStatCard
 title="Total Suppliers"
 value={suppliers.length.toString()}
 subtitle="registered suppliers"
 icon={Building2}
 color="bg-black text-white"
 />
 <SupplierStatCard
 title="Active"
 value={suppliers.filter((s) => s.isActive).length.toString()}
 subtitle="currently supplying"
 icon={CheckCircle}
 color="bg-emerald-100 text-emerald-700"
 />
 <SupplierStatCard
 title="Inactive"
 value={suppliers.filter((s) => !s.isActive).length.toString()}
 subtitle="not supplying"
 icon={XCircle}
 color="bg-red-100 text-red-700"
 />
 <SupplierStatCard
 title="Purchase Orders"
 value={suppliers.reduce((sum, s) => sum + (s._count?.purchaseOrders ?? 0), 0).toString()}
 subtitle="across all suppliers"
 icon={Package}
 color="bg-blue-100 text-blue-600"
 />
 </div>

 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
 <input
 type="text"
 placeholder="Search by supplier name, or email..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
 />
 </div>

 <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
 <th className="p-4 font-medium">Supplier</th>
 <th className="p-4 font-medium">Phone</th>
 <th className="p-4 font-medium">Purchase Orders</th>
 <th className="p-4 font-medium">Status</th>
 <th className="p-4 font-medium w-10"></th>
 </tr>
 </thead>
 <tbody>
 {isLoading && (
 <tr>
 <td colSpan={5} className="p-12 text-center text-neutral-500 text-sm">Loading suppliers...</td>
 </tr>
 )}
 {filtered.map((s) => (
 <tr key={s.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => setSelectedSupplier(s)}>
 <td className="p-4">
 <div>
 <p className="font-medium">{s.name}</p>
 <p className="text-xs text-neutral-500">{s.email ?? '—'}</p>
 </div>
 </td>
 <td className="p-4 text-neutral-500">{s.phone}</td>
 <td className="p-4 font-mono text-xs text-neutral-500">{s._count?.purchaseOrders ?? 0}</td>
 <td className="p-4">
 <span className={cn(
 "text-[11px] font-medium px-2.5 py-1 rounded-full",
 s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
 )}>
 {s.isActive ? 'Active' : 'Inactive'}
 </span>
 </td>
 <td className="p-4">
 <span className="text-neutral-400 hover:text-neutral-900 transition-colors text-xs font-medium cursor-pointer">
 View
 </span>
 </td>
 </tr>
 ))}
 {!isLoading && filtered.length === 0 && (
 <tr>
 <td colSpan={5} className="p-12 text-center text-neutral-500 text-sm">No suppliers found</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className="md:hidden space-y-3">
 {filtered.map((s) => (
 <div
 key={s.id}
 className="bg-white rounded-xl border border-border p-4 space-y-3 cursor-pointer"
 onClick={() => setSelectedSupplier(s)}
 >
 <div className="flex items-start justify-between">
 <div>
 <p className="text-sm font-medium">{s.name}</p>
 <p className="text-xs text-neutral-500">{s.email ?? '—'}</p>
 </div>
 <span className={cn(
 "text-[11px] font-medium px-2.5 py-1 rounded-full",
 s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
 )}>
 {s.isActive ? 'Active' : 'Inactive'}
 </span>
 </div>
 <div className="flex items-center gap-3 text-xs text-neutral-500">
 <span>{s.phone}</span>
 <span>{s._count?.purchaseOrders ?? 0} purchase order{s._count?.purchaseOrders !== 1 ? 's' : ''}</span>
 </div>
 </div>
 ))}
 {filtered.length === 0 && (
 <div className="bg-white rounded-xl border border-border p-12 text-center text-neutral-500 text-sm">No suppliers found</div>
 )}
 </div>

 <AnimatePresence>
 {selectedSupplier && (
 <SupplierDetailDrawer
 supplier={selectedSupplier}
 onClose={() => setSelectedSupplier(null)}
 />
 )}
 </AnimatePresence>
 </div>
 );
}

function SupplierDetailDrawer({ supplier, onClose }: { supplier: Supplier; onClose: () => void }) {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 bg-black/50"
 onClick={onClose}
 >
 <motion.div
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}
 onClick={(e) => e.stopPropagation()}
 className="absolute right-0 top-0 h-full w-full max-w-lg bg-white border-l border-border shadow-xl overflow-y-auto"
 >
 <div className="flex items-center justify-between p-6 border-b border-border">
 <div>
 <h2 className="font-display text-lg font-bold">{supplier.name}</h2>
 <p className="text-xs text-neutral-500 mt-0.5">ID: {supplier.id}</p>
 </div>
 <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="p-6 space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
 <Mail className="w-4 h-4 text-neutral-500" />
 </div>
 <div className="min-w-0">
 <p className="text-xs text-neutral-500">Email</p>
 <p className="text-sm font-medium truncate">{supplier.email ?? '—'}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
 <Phone className="w-4 h-4 text-neutral-500" />
 </div>
 <div>
 <p className="text-xs text-neutral-500">Phone</p>
 <p className="text-sm font-medium">{supplier.phone}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 sm:col-span-2">
 <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
 <MapPin className="w-4 h-4 text-neutral-500" />
 </div>
 <div>
 <p className="text-xs text-neutral-500">Address</p>
 <p className="text-sm font-medium">{supplier.address ?? '—'}</p>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 rounded-lg">
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4 text-neutral-500" />
 <span className="text-sm text-neutral-500">Since {new Date(supplier.createdAt).toLocaleDateString('en-BD', { month: 'long', year: 'numeric' })}</span>
 </div>
 <span className={cn(
 "text-[11px] font-medium px-2.5 py-1 rounded-full",
 supplier.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
 )}>
 {supplier.isActive ? 'Active' : 'Inactive'}
 </span>
 </div>

 <div>
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
 Purchase Orders ({supplier._count?.purchaseOrders ?? 0})
 </h3>
 </div>
 {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 ? (
 <div className="space-y-2">
 {supplier.purchaseOrders.map((po) => (
 <div key={po.id} className="flex items-center justify-between px-4 py-3 bg-neutral-100 rounded-lg">
 <span className="text-sm font-medium">PO #{po.id.slice(0, 8)}</span>
 <span className="text-xs text-neutral-500 font-mono">৳{Number(po.totalCost).toLocaleString()}</span>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-neutral-500">No purchase orders yet</p>
 )}
 </div>

 <div className="flex gap-3 pt-2">
 <button
 onClick={onClose}
 className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
 >
 Close
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 );
}

function SupplierStatCard({ title, value, subtitle, icon: Icon, color }: {
 title: string; value: string; subtitle: string; icon: ElementType; color: string;
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
 <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
 <p className="text-[10px] text-neutral-500/60 mt-0.5">{subtitle}</p>
 </motion.div>
 );
}
