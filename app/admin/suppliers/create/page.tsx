'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Field, getInputClass } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { Save, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CreateSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', address: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const errors: Record<string, string> = {};
  if (!form.name.trim() && touched.name) errors.name = 'Supplier name is required';
  if (!form.contact.trim() && touched.contact) errors.contact = 'Contact person is required';
  if (!form.phone.trim() && touched.phone) errors.phone = 'Phone number is required';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && touched.email) errors.email = 'Invalid email format';
  if (touched.categories && categories.length === 0) errors.categories = 'Select at least one category';

  const valid = form.name.trim() && form.contact.trim() && form.phone.trim() && categories.length > 0;

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSubmit = () => {
    setTouched({ name: true, contact: true, phone: true, categories: true });
    if (!valid) return;
    setSubmitting(true);

    const supplier = {
      id: `sup_${Date.now().toString(36)}`,
      name: form.name.trim(),
      contactPerson: form.contact.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || 'N/A',
      status: 'active' as const,
      supplyCategories: categories,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(sessionStorage.getItem('new_suppliers') || '[]');
    existing.unshift(supplier);
    sessionStorage.setItem('new_suppliers', JSON.stringify(existing));

    setTimeout(() => {
      toast(`Supplier "${supplier.name}" created successfully`);
      router.push('/admin/suppliers');
    }, 400);
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
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Add Supplier</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6" onKeyDown={handleKeyDown}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Supplier Name" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  placeholder="e.g. TexPrime Garments"
                  autoFocus
                  className={getInputClass(errors.name)}
                />
              </Field>
            </div>
            <Field label="Contact Person" required error={errors.contact}>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => set('contact', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, contact: true }))}
                placeholder="Full name"
                className={getInputClass(errors.contact)}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                placeholder="email@supplier.com"
                className={getInputClass(errors.email)}
              />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                placeholder="017xxxxxxxx"
                className={getInputClass(errors.phone)}
              />
            </Field>
            <Field label="Address">
              <input
                type="text"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Factory address"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black/10 placeholder:text-muted/60"
              />
            </Field>
          </div>

          <div>
            <label className="text-xs text-muted uppercase tracking-wider font-medium mb-2 block">
              Supply Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {['polo', 'tshirt'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { toggleCategory(cat); setTouched((p) => ({ ...p, categories: true })); }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200",
                    categories.includes(cat)
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-muted border-border hover:border-black hover:text-black",
                  )}
                >
                  {cat === 'tshirt' ? 'T-Shirt' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.categories}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => router.back()} className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              Add Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
