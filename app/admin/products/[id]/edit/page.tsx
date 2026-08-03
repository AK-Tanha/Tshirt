'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useCategories } from '@/hooks/use-categories';
import { Field, getInputClass } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { ImageDropzone } from '@/components/ImageDropzone';
import { useToast } from '@/components/ui/Toast';
import type { Product, Supplier, Category } from '@/lib/types';
import {
  ArrowLeft, Save, Package, Settings,
  LayoutGrid, Loader2, AlertCircle, Check, Eye,
} from 'lucide-react';

type Tab = 'basic' | 'variants' | 'publish';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'basic', label: 'Basic Info', icon: <Settings className="w-4 h-4" /> },
  { id: 'variants', label: 'Variants', icon: <Package className="w-4 h-4" /> },
  { id: 'publish', label: 'Publish', icon: <LayoutGrid className="w-4 h-4" /> },
];

export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(params.id);
  const { data: suppliers = [] } = useSuppliers();
  const { data: categories = [] } = useCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Product not found</p>
      </div>
    );
  }

  return (
    <ProductForm
      key={product.id}
      product={product}
      suppliers={suppliers}
      categories={categories}
      onCancel={() => router.back()}
    />
  );
}

function ProductForm({ product, suppliers, categories, onCancel }: {
  product: Product;
  suppliers: Supplier[];
  categories: Category[];
  onCancel: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const updateProduct = useUpdateProduct();

  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.basePrice);
  const [description, setDescription] = useState(product.description ?? '');
  const [categoryId, setCategoryId] = useState(product.categoryId ?? '');
  const [supplierId, setSupplierId] = useState(product.supplierId ?? '');
  const [variants, setVariants] = useState(product.variants);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product.images?.map((i) => i.url) ?? [],
  );
  const [heroUrl, setHeroUrl] = useState<string>(
    product.images?.find((i) => i.isHero)?.url ?? product.images?.[0]?.url ?? '',
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const errors: Record<string, string> = {};
  if (!name.trim() && touched.name) errors.name = 'Product name is required';
  if (touched.price && (!price || Number(price) <= 0)) errors.price = 'Enter a valid price';

  const valid = name.trim() && price && Number(price) > 0;

  const handleSave = () => {
    setTouched({ name: true, price: true });
    if (!valid) return;
    setSaving(true);
    updateProduct.mutate(
      {
        id: product.id,
        payload: {
          name: name.trim(),
          basePrice: Number(price),
          description,
          categoryId,
          supplierId: supplierId || undefined,
          imageUrls,
          ...(heroUrl && { heroImageUrl: heroUrl }),
        },
      },
      {
        onSuccess: () => {
          toast('Product updated successfully');
          router.push('/admin/products');
        },
        onError: (err) => {
          toast(err.message, 'error');
          setSaving(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Edit &ldquo;{product.name}&rdquo;
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Manage product details and variants</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${product.id}`}
            className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Eye className="w-4 h-4" /> View Product
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border pb-0.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-neutral-900 text-neutral-900 '
                : 'border-transparent text-neutral-500 hover:text-neutral-900 ',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'basic' && (
            <Card className="p-6 space-y-5">
              <CardTitle>Basic Information</CardTitle>
              <Field label="Product Name" required error={errors.name}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  placeholder="e.g. Classic Navy Polo"
                  className={getInputClass(errors.name)}
                />
              </Field>
              <Field label="Category">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors resize-none placeholder:text-neutral-400"
                />
              </Field>
              <div className="pt-1">
                <ImageDropzone
                  label="Product Images"
                  value={imageUrls}
                  onChange={(urls) => {
                    setImageUrls(urls);
                    setHeroUrl((prev) => (urls.includes(prev) ? prev : urls[0] ?? ''));
                  }}
                  heroUrl={heroUrl}
                  onHeroChange={setHeroUrl}
                  maxImages={8}
                />
              </div>
            </Card>
          )}

          {activeTab === 'variants' && (
            <Card className="p-6 space-y-5">
              <CardTitle>Variants</CardTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider border-b border-border">
                      <th className="pb-3 font-medium">Size</th>
                      <th className="pb-3 font-medium">Color</th>
                      <th className="pb-3 font-medium text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v.id} className="border-b border-border/50">
                        <td className="py-2 pr-2">{v.size}</td>
                        <td className="py-2 px-2">{v.color}</td>
                        <td className="py-2 pl-2 text-right font-mono">{v.stock}</td>
                      </tr>
                    ))}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-12 text-center text-sm text-neutral-500">No variants</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Variants can only be managed on the backend for now.
              </p>
            </Card>
          )}

          {activeTab === 'publish' && (
            <Card className="p-6 space-y-5">
              <CardTitle>Publishing & Organization</CardTitle>
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
              <Field label="Supplier">
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors"
                >
                  <option value="">No supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Field>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <CardTitle className="mb-3 text-sm">Summary</CardTitle>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Status</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Category</span>
                <span className="font-medium">
                  {categories.find((c) => c.id === categoryId)?.name ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Variants</span>
                <span className="font-medium">{variants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Price</span>
                <span className="font-mono font-medium">৳{Number(price || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Supplier</span>
                <span className="text-right text-xs">{suppliers.find((s) => s.id === supplierId)?.name ?? '—'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <CardTitle className="mb-3 text-sm">Actions</CardTitle>
            <div className="space-y-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </button>
              <button
                onClick={onCancel}
                className="w-full px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
