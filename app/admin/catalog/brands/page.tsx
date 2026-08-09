'use client';

import { useState } from 'react';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/use-brands';
import { Card } from '@/components/ui/Card';
import { Field, getInputClass } from '@/components/ui/Field';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Shirt,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import type { Brand } from '@/lib/types';

interface BrandFormState {
  id: string | null;
  name: string;
  slug: string;
}

const emptyForm: BrandFormState = { id: null, name: '', slug: '' };

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminBrands() {
  const { data: brands = [], isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<BrandFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const q = search.toLowerCase();
  const filtered = brands.filter(
    (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q),
  );

  const openCreate = () => {
    setForm({ ...emptyForm });
    setSlugTouched(false);
    setFormOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setForm({ id: brand.id, name: brand.name, slug: brand.slug });
    setSlugTouched(true);
    setFormOpen(true);
  };

  const validForm = form.name.trim() && form.slug.trim();

  const handleSubmit = () => {
    if (!validForm) return;

    const payload = { name: form.name.trim(), slug: toSlug(form.slug.trim()) };

    if (form.id) {
      updateBrand.mutate(
        { id: form.id, payload },
        {
          onSuccess: () => {
            toast('Brand updated');
            setFormOpen(false);
          },
          onError: (err) => toast(err.message, 'error'),
        },
      );
    } else {
      createBrand.mutate(payload, {
        onSuccess: () => {
          toast('Brand created');
          setFormOpen(false);
        },
        onError: (err) => toast(err.message, 'error'),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteBrand.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast(`Deleted "${deleteTarget.name}"`);
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast(err.message, 'error');
        setDeleteTarget(null);
      },
    });
  };

  const busy =
    createBrand.isPending || updateBrand.isPending || deleteBrand.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Brands
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {brands.length} total brands
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">Loading brands...</p>
          </Card>
        )}
        {filtered.map((brand) => (
          <Card key={brand.id} className="p-5 group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Shirt className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{brand.name}</p>
                  <p className="text-xs text-neutral-500 font-mono">
                    /{brand.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(brand)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label={`Edit ${brand.name}`}
                >
                  <Pencil className="w-4 h-4 text-neutral-500 hover:text-black" />
                </button>
                <button
                  onClick={() => setDeleteTarget(brand)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={`Delete ${brand.name}`}
                >
                  <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
              <Package className="w-3.5 h-3.5" />
              {brand._count?.products ?? 0} product
              {brand._count?.products !== 1 ? 's' : ''}
            </div>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">No brands found</p>
          </Card>
        )}
      </div>

      {/* Create / Edit modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
            onClick={() => !busy && setFormOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl border border-border w-full max-w-md p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {form.id ? 'Edit Brand' : 'New Brand'}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {form.id
                      ? 'Update the name or URL slug.'
                      : 'Brands appear on product cards and filters.'}
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  disabled={busy}
                  className="p-1.5 hover:bg-stone rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const nextName = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name: nextName,
                        slug: slugTouched ? prev.slug : toSlug(nextName),
                      }));
                    }}
                    placeholder="e.g. Nike"
                    autoFocus
                    disabled={busy}
                    className={getInputClass(undefined, 'disabled:opacity-50')}
                  />
                </Field>
                <Field label="Slug" required>
                  <div className="flex items-center rounded-lg border border-border focus-within:border-black transition-colors overflow-hidden">
                    <span className="px-3 text-sm text-neutral-400 font-mono bg-neutral-50 h-[42px] flex items-center border-r border-border">
                      /
                    </span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setForm({ ...form, slug: e.target.value });
                      }}
                      placeholder="nike"
                      disabled={busy}
                      className="w-full px-3 py-2.5 text-sm outline-none font-mono disabled:opacity-50"
                    />
                  </div>
                  {!slugTouched && form.name && (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Auto: /{toSlug(form.name)}
                    </p>
                  )}
                </Field>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFormOpen(false)}
                  disabled={busy}
                  className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!validForm || busy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.id ? 'Save Changes' : 'Create Brand'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete brand?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed. This can't be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
