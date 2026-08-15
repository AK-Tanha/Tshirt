'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useCollections,
  useCollection,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/hooks/use-collections';
import { useProducts } from '@/hooks/use-products';
import { Card } from '@/components/ui/Card';
import { Field, getInputClass } from '@/components/ui/Field';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ImageDropzone } from '@/components/ImageDropzone';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Layers,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ListChecks,
} from 'lucide-react';
import type { Collection } from '@/lib/types';

interface CollectionFormState {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  image: string;
  mobileImage: string;
  isActive: boolean;
}

const emptyForm: CollectionFormState = {
  id: null,
  name: '',
  slug: '',
  description: '',
  image: '',
  mobileImage: '',
  isActive: true,
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCollections() {
  const { data: collections = [], isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CollectionFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const [manageTarget, setManageTarget] = useState<Collection | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [savingProducts, setSavingProducts] = useState(false);

  const { data: collectionDetail, isLoading: detailLoading } = useCollection(
    manageTarget?.id ?? '',
  );
  const { data: productsData } = useProducts({ limit: 500 });
  const allProducts = productsData?.data ?? [];

  const [prevDetailId, setPrevDetailId] = useState<string | null>(null);
  if (manageTarget && collectionDetail && collectionDetail.id !== prevDetailId) {
    setPrevDetailId(collectionDetail.id);
    setSelectedIds(collectionDetail.products?.map((p) => p.id) ?? []);
    setPickerSearch('');
  }

  const closeManage = () => {
    setPrevDetailId(null);
    setManageTarget(null);
  };

  const pq = pickerSearch.toLowerCase();
  const pickerProducts = allProducts.filter(
    (p) => p.name.toLowerCase().includes(pq) || (p.brand?.name ?? '').toLowerCase().includes(pq),
  );

  const q = search.toLowerCase();
  const filtered = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description ?? '').toLowerCase().includes(q),
  );

  const openCreate = () => {
    setForm({ ...emptyForm });
    setSlugTouched(false);
    setFormOpen(true);
  };

  const openEdit = (collection: Collection) => {
    setForm({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description ?? '',
      image: collection.image ?? '',
      mobileImage: collection.mobileImage ?? '',
      isActive: collection.isActive,
    });
    setSlugTouched(true);
    setFormOpen(true);
  };

  const validForm = form.name.trim() && form.slug.trim();

  const handleSubmit = () => {
    if (!validForm) return;

    const payload = {
      name: form.name.trim(),
      slug: toSlug(form.slug.trim()),
      description: form.description.trim() || undefined,
      image: form.image.trim() || undefined,
      mobileImage: form.mobileImage.trim() || undefined,
      isActive: form.isActive,
    };

    if (form.id) {
      updateCollection.mutate(
        { id: form.id, payload },
        {
          onSuccess: () => {
            toast('Collection updated');
            setFormOpen(false);
          },
          onError: (err) => toast(err.message, 'error'),
        },
      );
    } else {
      createCollection.mutate(payload, {
        onSuccess: () => {
          toast('Collection created');
          setFormOpen(false);
        },
        onError: (err) => toast(err.message, 'error'),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCollection.mutate(deleteTarget.id, {
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
    createCollection.isPending ||
    updateCollection.isPending ||
    deleteCollection.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Collections
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {collections.length} total collections
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">Loading collections...</p>
          </Card>
        )}
        {filtered.map((collection) => (
          <Card key={collection.id} className="p-5 group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{collection.name}</p>
                    {!collection.isActive && (
                      <Badge variant="neutral">Hidden</Badge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    /{collection.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(collection)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label={`Edit ${collection.name}`}
                >
                  <Pencil className="w-4 h-4 text-neutral-500 hover:text-black" />
                </button>
                <button
                  onClick={() => setDeleteTarget(collection)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={`Delete ${collection.name}`}
                >
                  <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                </button>
              </div>
            </div>
            {collection.description && (
              <p className="text-sm text-neutral-500 mt-3 line-clamp-2">
                {collection.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500">
              <Package className="w-3.5 h-3.5" />
              {collection._count?.products ?? 0} product
              {collection._count?.products !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => setManageTarget(collection)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <ListChecks className="w-4 h-4" /> Manage Products
            </button>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">No collections found</p>
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
              className="bg-white rounded-xl border border-border w-full max-w-md flex flex-col max-h-[90vh]"
            >
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {form.id ? 'Edit Collection' : 'New Collection'}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {form.id
                      ? 'Update the name, slug or visibility.'
                      : 'Group products into a featured set.'}
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

              <div className="flex-1 overflow-y-auto px-6 space-y-4">
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
                    placeholder="e.g. Summer Sale"
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
                      placeholder="summer-sale"
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
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Optional description shown on the collection page..."
                    rows={3}
                    disabled={busy}
                    className="w-full px-3 py-2.5 text-sm outline-none resize-none border border-border rounded-lg focus:border-black transition-colors disabled:opacity-50"
                  />
                </Field>
                <Field label="Banner image">
                  <ImageDropzone
                    value={form.image ? [form.image] : []}
                    onChange={(urls) =>
                      setForm({ ...form, image: urls[0] ?? '' })
                    }
                    maxImages={1}
                    heroUrl={form.image}
                  />
                </Field>
                <Field label="Mobile image (portrait)">
                  <ImageDropzone
                    value={form.mobileImage ? [form.mobileImage] : []}
                    onChange={(urls) =>
                      setForm({ ...form, mobileImage: urls[0] ?? '' })
                    }
                    maxImages={1}
                    heroUrl={form.mobileImage}
                  />
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    Portrait crop used on small screens (hero). Falls back to
                    the banner image when not set.
                  </p>
                </Field>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Visible on storefront</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isActive}
                    onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                    disabled={busy}
                    className={`w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
                      form.isActive ? 'bg-black' : 'bg-neutral-200'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div className="flex gap-3 p-6 pt-4">
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
                  {form.id ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage products modal */}
      <AnimatePresence>
        {manageTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
            onClick={() => !savingProducts && closeManage()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl border border-border w-full max-w-lg flex flex-col max-h-[80vh]"
            >
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {manageTarget.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {selectedIds.length} product
                    {selectedIds.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={() => closeManage()}
                  disabled={savingProducts}
                  className="p-1.5 hover:bg-stone rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    disabled={detailLoading}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-4">
                {detailLoading ? (
                  <p className="text-sm text-neutral-500 text-center py-10">
                    Loading products...
                  </p>
                ) : pickerProducts.length === 0 ? (
                  <p className="text-sm text-neutral-500 text-center py-10">
                    No products found
                  </p>
                ) : (
                  <div className="divide-y divide-border/60 border border-border rounded-lg">
                    {pickerProducts.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-neutral-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(product.id)
                                ? prev.filter((id) => id !== product.id)
                                : [...prev, product.id],
                            )
                          }
                          className="w-4 h-4 rounded border-border accent-black shrink-0"
                        />
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {product.brand?.name ?? 'No brand'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 pt-4 border-t border-border">
                <button
                  onClick={() => closeManage()}
                  disabled={savingProducts}
                  className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!manageTarget) return;
                    setSavingProducts(true);
                    updateCollection.mutate(
                      { id: manageTarget.id, payload: { productIds: selectedIds } },
                      {
                        onSuccess: () => {
                          toast('Collection products updated');
                          setSavingProducts(false);
                          closeManage();
                        },
                        onError: (err) => {
                          toast(err.message, 'error');
                          setSavingProducts(false);
                        },
                      },
                    );
                  }}
                  disabled={savingProducts}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProducts && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Products
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete collection?"
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
