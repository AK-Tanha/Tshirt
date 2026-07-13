'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { suppliers } from '@/lib/data';
import { ImageDropzone, type ImageFile } from '@/components/ImageDropzone';
import { Field, getInputClass } from '@/components/ui/Field';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'tshirt' | 'polo'>('tshirt');
  const [supplierId, setSupplierId] = useState('');
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
    setTimeout(() => {
      const existing = JSON.parse(sessionStorage.getItem('new_products') || '[]');
      existing.unshift({
        id: `p_${Date.now().toString(36)}`,
        name: name.trim(),
        price: Number(price),
        description,
        category,
        supplierId,
        heroImage: heroImages[0]?.dataUrl || 'https://picsum.photos/seed/placeholder/800/800',
        extraImages: extraImages.map((i) => i.dataUrl),
      });
      sessionStorage.setItem('new_products', JSON.stringify(existing));
      router.push('/admin/products');
    }, 600);
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
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as 'tshirt' | 'polo')} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a3a3a3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
                <option value="tshirt">T-Shirt</option>
                <option value="polo">Polo</option>
              </select>
            </Field>
          </div>

          <Field label="Supplier">
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a3a3a3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10">
              <option value="">Select a supplier...</option>
              {suppliers.filter((s) => s.status === 'active').map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
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
