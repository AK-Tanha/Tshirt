'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { vendors as initialVendors, products as allProducts } from '@/lib/data';
import type { Vendor } from '@/lib/types';
import {
  Search, Building2, Plus, X, Mail, Phone, MapPin,
  Package, Calendar, CheckCircle, XCircle,
} from 'lucide-react';

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('new_vendors') || '[]');
    setVendors([...stored, ...initialVendors]);
    sessionStorage.removeItem('new_vendors');
  }, []);

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.contactPerson.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Vendors</h1>
        <Link
          href="/admin/vendors/create"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Vendor</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VendorStatCard
          title="Total Vendors"
          value={vendors.length.toString()}
          subtitle="registered suppliers"
          icon={Building2}
          color="bg-black text-white"
        />
        <VendorStatCard
          title="Active"
          value={vendors.filter((v) => v.status === 'active').length.toString()}
          subtitle="currently supplying"
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-700"
        />
        <VendorStatCard
          title="Inactive"
          value={vendors.filter((v) => v.status === 'inactive').length.toString()}
          subtitle="not supplying"
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
        <VendorStatCard
          title="Products Supplied"
          value={allProducts.length.toString()}
          subtitle="across all vendors"
          icon={Package}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search by vendor name, contact person, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wider bg-stone/50">
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium">Contact Person</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Categories</th>
                <th className="p-4 font-medium">Products</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const vendorProducts = allProducts.filter((p) => p.vendorId === v.id);
                return (
                  <tr key={v.id} className="border-t border-border text-sm hover:bg-stone/30 transition-colors cursor-pointer" onClick={() => setSelectedVendor(v)}>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-muted">{v.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{v.contactPerson}</td>
                    <td className="p-4 text-muted">{v.phone}</td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        {v.supplyCategories.map((cat) => (
                          <span key={cat} className="text-[10px] font-medium bg-stone px-2 py-0.5 rounded-md capitalize">
                            {cat === 'tshirt' ? 'T-Shirt' : cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-muted">{vendorProducts.length}</td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[11px] font-medium px-2.5 py-1 rounded-full",
                        v.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                      )}>
                        {v.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-muted hover:text-black transition-colors text-xs font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted text-sm">No vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((v) => {
          const vendorProducts = allProducts.filter((p) => p.vendorId === v.id);
          return (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-border p-4 space-y-3 cursor-pointer"
              onClick={() => setSelectedVendor(v)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{v.name}</p>
                  <p className="text-xs text-muted">{v.contactPerson}</p>
                </div>
                <span className={cn(
                  "text-[11px] font-medium px-2.5 py-1 rounded-full",
                  v.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                )}>
                  {v.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{v.phone}</span>
                <span>{vendorProducts.length} product{vendorProducts.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex gap-1.5">
                {v.supplyCategories.map((cat) => (
                  <span key={cat} className="text-[10px] font-medium bg-stone px-2 py-0.5 rounded-md capitalize">
                    {cat === 'tshirt' ? 'T-Shirt' : cat}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">No vendors found</div>
        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <VendorDetailModal
            vendor={selectedVendor}
            onClose={() => setSelectedVendor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function VendorDetailModal({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const vendorProducts = allProducts.filter((p) => p.vendorId === vendor.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold">{vendor.name}</h2>
            <p className="text-xs text-muted mt-0.5">ID: {vendor.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm font-medium truncate">{vendor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="text-sm font-medium">{vendor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-stone flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Address</p>
                <p className="text-sm font-medium">{vendor.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-stone rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted" />
              <span className="text-sm text-muted">Since {new Date(vendor.createdAt).toLocaleDateString('en-BD', { month: 'long', year: 'numeric' })}</span>
            </div>
            <span className={cn(
              "text-[11px] font-medium px-2.5 py-1 rounded-full",
              vendor.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
            )}>
              {vendor.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <h3 className="text-xs text-muted uppercase tracking-wider font-medium mb-3">Supply Categories</h3>
            <div className="flex gap-2">
              {vendor.supplyCategories.map((cat) => (
                <span key={cat} className="text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg capitalize">
                  {cat === 'tshirt' ? 'T-Shirt' : cat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-muted uppercase tracking-wider font-medium">
                Products Supplied ({vendorProducts.length})
              </h3>
              <Link
                href="/admin/products"
                onClick={onClose}
                className="text-xs text-muted hover:text-black transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {vendorProducts.map((p) => (
                <Link
                  key={p.id}
                  href="/admin/products"
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 bg-stone rounded-lg hover:bg-stone/80 transition-colors"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted font-mono">৳{p.price.toLocaleString()}</span>
                </Link>
              ))}
              {vendorProducts.length === 0 && (
                <p className="text-sm text-muted">No products currently assigned</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
              Edit Vendor
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VendorStatCard({ title, value, subtitle, icon: Icon, color }: {
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
