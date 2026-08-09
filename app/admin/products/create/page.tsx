'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCreateProduct } from '@/hooks/use-products';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import { useCollections } from '@/hooks/use-collections';
import { Field, getInputClass } from '@/components/ui/Field';
import { ImageDropzone } from '@/components/ImageDropzone';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface VariantForm {
  size: string;
  color: string;
  stock: string;
  price: string;
}

const sizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: suppliers = [] } = useSuppliers();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: collections = [] } = useCollections();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [heroUrl, setHeroUrl] = useState<string>('');
  const [variants, setVariants] = useState<VariantForm[]>([
    { size: 'M', color: '', stock: '0', price: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string> = {};
  if (!name.trim() && touched.name) errors.name = 'Product name is required';
  if (touched.price && (!price || Number(price) <= 0)) errors.price = 'Enter a valid price';
  if (!categoryId && touched.categoryId) errors.categoryId = 'Select a category';

  const validVariants = variants.filter((v) => v.color.trim()).length > 0;
  const valid = name.trim() && price && Number(price) > 0 && categoryId && validVariants;

  const updateVariant = (index: number, key: keyof VariantForm, value: string) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: 'M', color: '', stock: '0', price: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setTouched({ name: true, price: true, categoryId: true });
    if (!valid) return;
    setSubmitting(true);
    createProduct.mutate(
      {
        name: name.trim(),
        basePrice: Number(price),
        description,
        categoryId,
        supplierId: supplierId || undefined,
        brandId: brandId || undefined,
        collectionIds,
        imageUrls: imageUrls,
        ...(heroUrl && { heroImageUrl: heroUrl }),
        variants: variants
          .filter((v) => v.color.trim())
          .map((v) => ({
            size: v.size,
            color: v.color.trim(),
            stock: Math.max(0, parseInt(v.stock) || 0),
            price: v.price ? Number(v.price) : undefined,
          })),
      },
      {
        onSuccess: () => {
          router.push('/admin/products');
        },
        onError: (err) => {
          setSubmitting(false);
          alert(err.message);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Add Product</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6" onKeyDown={handleKeyDown}>
        <div className="space-y-5">
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
            <Field label="Category" required error={errors.categoryId}>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, categoryId: true }))}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
              >
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Supplier">
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
            >
              <option value="">Select a supplier...</option>
              {suppliers.filter((s) => s.isActive).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Brand">
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10"
            >
              <option value="">Select a brand...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Collections">
            <div className="max-h-40 overflow-y-auto border border-border rounded-lg divide-y divide-border/50">
              {collections.length === 0 && (
                <p className="px-3 py-2.5 text-sm text-neutral-400">
                  No collections yet
                </p>
              )}
              {collections.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-stone transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={collectionIds.includes(c.id)}
                    onChange={() =>
                      setCollectionIds((prev) =>
                        prev.includes(c.id)
                          ? prev.filter((id) => id !== c.id)
                          : [...prev, c.id],
                      )
                    }
                    className="w-4 h-4 rounded border-border accent-black"
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </Field>

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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted uppercase tracking-wider font-medium">
                Variants <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="text-[10px] text-muted uppercase tracking-wider mb-1 block">Size</label>
                    <select
                      value={v.size}
                      onChange={(e) => updateVariant(i, 'size', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                    >
                      {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-muted uppercase tracking-wider mb-1 block">Color</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => updateVariant(i, 'color', e.target.value)}
                      placeholder="Navy"
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted uppercase tracking-wider mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                      min={0}
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted uppercase tracking-wider mb-1 block">Price</label>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => updateVariant(i, 'price', e.target.value)}
                        min={0}
                        placeholder="Opt"
                        className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={variants.length === 1}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 resize-none placeholder:text-muted/60"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
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
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
