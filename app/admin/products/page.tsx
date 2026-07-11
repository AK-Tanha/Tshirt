'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products as initialProducts, variants, vendors } from '@/lib/data';
import type { Product, ProductVariant } from '@/lib/types';
import { ImageDropzone, type ImageFile } from '@/components/ImageDropzone';
import { Field, getInputClass } from '@/components/ui/Field';
import {
  Plus, Search, Edit3, Trash2, X, Loader2,
} from 'lucide-react';

const categoryLabels: Record<string, string> = { polo: 'Polo', tshirt: 'T-Shirt' };
const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v]));

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('new_products') || '[]');
    setProducts([...stored, ...initialProducts]);
    sessionStorage.removeItem('new_products');
  }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const vendor = vendorMap[p.vendorId ?? ''];
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (vendor?.name.toLowerCase().includes(q) ?? false);
    const matchesVendor = vendorFilter === 'all' || p.vendorId === vendorFilter;
    return matchesSearch && matchesVendor;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name, category or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-muted outline-none focus:border-black transition-colors"
        >
          <option value="all">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const productVariants = variants.filter((v) => v.productId === product.id);
          const totalStock = productVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
          return (
            <div key={product.id} className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-sm transition-shadow">
              <div className="relative aspect-[4/3] bg-stone">
                <Image src={product.heroImage} alt={product.name} fill className="object-cover" />
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-stone transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {categoryLabels[product.category]}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">৳{product.price.toLocaleString()}</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    totalStock > 10 ? "bg-emerald-100 text-emerald-700" : totalStock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700",
                  )}>
                    {totalStock} in stock
                  </span>
                </div>
                <div className="text-xs text-muted">
                  Vendor: <span className="text-black font-medium">{vendorMap[product.vendorId ?? '']?.name ?? '—'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {productVariants.map((v) => (
                    <span key={v.id} className="text-[10px] text-muted bg-stone px-2 py-0.5 rounded-md">
                      {v.size} {v.color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">No products found</div>
        )}
      </div>

      <AnimatePresence>
        {editingProduct && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductFormModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product?.price.toString() ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [category, setCategory] = useState<'tshirt' | 'polo'>(product?.category ?? 'tshirt');
  const [vendorId, setVendorId] = useState(product?.vendorId ?? '');
  const [heroImages, setHeroImages] = useState<ImageFile[]>([]);
  const [extraImages, setExtraImages] = useState<ImageFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string> = {};
  if (!name.trim() && touched.name) errors.name = 'Product name is required';
  if (touched.price && (!price || Number(price) <= 0)) errors.price = 'Enter a valid price';

  const valid = name.trim() && price && Number(price) > 0;
  const handleSubmit = () => {
    setTouched({ name: true, price: true });
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onClose(); }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

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
          <h2 className="font-display text-lg font-bold">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5" onKeyDown={handleKeyDown}>
          <Field label="Product Name" required error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              placeholder="e.g. Classic Navy Polo"
              autoFocus
              className={getInputClass(errors.name)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (৳)" required error={errors.price}>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, price: true }))}
                placeholder="850"
                min={1}
                className={getInputClass(errors.price)}
              />
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as 'tshirt' | 'polo')} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a3a3a3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
                <option value="tshirt">T-Shirt</option>
                <option value="polo">Polo</option>
              </select>
            </Field>
          </div>

          <Field label="Supplier">
            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a3a3a3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
              <option value="">Select a vendor...</option>
              {vendors.filter((v) => v.status === 'active').map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 resize-none placeholder:text-muted/60"
            />
          </Field>

          <ImageDropzone images={heroImages} onChange={setHeroImages} maxImages={1} label="Hero Image" />
          <ImageDropzone images={extraImages} onChange={setExtraImages} maxImages={8} label="Extra Images" />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
