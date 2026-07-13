'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products as initialProducts, variants as initialVariants, suppliers } from '@/lib/data';
import { ImageDropzone, type ImageFile } from '@/components/ImageDropzone';
import { Field, getInputClass } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import type { Product, ProductVariant } from '@/lib/types';
import {
 ArrowLeft, Save, Package, ImageIcon, Settings,
 LayoutGrid, Loader2, Plus, Trash2, AlertCircle, Check, Eye,
} from 'lucide-react';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;
const categoryLabels: Record<string, string> = { polo: 'Polo', tshirt: 'T-Shirt' };

type Tab = 'basic' | 'images' | 'variants' | 'publish';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
 { id: 'basic', label: 'Basic Info', icon: <Settings className="w-4 h-4" /> },
 { id: 'images', label: 'Images', icon: <ImageIcon className="w-4 h-4" /> },
 { id: 'variants', label: 'Variants', icon: <Package className="w-4 h-4" /> },
 { id: 'publish', label: 'Publish', icon: <LayoutGrid className="w-4 h-4" /> },
];

export default function ProductEditPage() {
 const params = useParams();
 const router = useRouter();
 const { toast } = useToast();

 const [activeTab, setActiveTab] = useState<Tab>('basic');
 const [product, setProduct] = useState<Product | null>(null);
 const [variants, setVariants] = useState<ProductVariant[]>([]);
 const [saving, setSaving] = useState(false);

 const [name, setName] = useState('');
 const [slug, setSlug] = useState('');
 const [price, setPrice] = useState('');
 const [description, setDescription] = useState('');
 const [category, setCategory] = useState<'tshirt' | 'polo'>('tshirt');
 const [supplierId, setSupplierId] = useState('');
 const [heroImages, setHeroImages] = useState<ImageFile[]>([]);
 const [extraImages, setExtraImages] = useState<ImageFile[]>([]);
 const [touched, setTouched] = useState<Record<string, boolean>>({});

 useEffect(() => {
 const stored = JSON.parse(sessionStorage.getItem('new_products') || '[]');
 const all = [...stored, ...initialProducts];
 const found = all.find((p: Product) => p.id === params.id);
 if (found) {
 setProduct(found);
 setName(found.name);
 setSlug(found.slug);
 setPrice(found.price.toString());
 setDescription(found.description);
 setCategory(found.category);
 setSupplierId(found.supplierId ?? '');
 setVariants(initialVariants.filter((v) => v.productId === found.id));
 }
 }, [params.id]);

 const errors: Record<string, string> = {};
 if (!name.trim() && touched.name) errors.name = 'Product name is required';
 if (touched.price && (!price || Number(price) <= 0)) errors.price = 'Enter a valid price';
 if (!slug.trim() && touched.slug) errors.slug = 'Slug is required';

 const valid = name.trim() && price && Number(price) > 0 && slug.trim();

 const handleSave = () => {
 setTouched({ name: true, price: true, slug: true });
 if (!valid) return;
 setSaving(true);
 setTimeout(() => {
 const updated: Product = {
 id: product?.id ?? crypto.randomUUID().slice(0, 8),
 slug: slug.trim(),
 name: name.trim(),
 description,
 category,
 price: Number(price),
 supplierId: supplierId || undefined,
 heroImage: heroImages[0]?.dataUrl ?? product?.heroImage ?? '',
 extraImages: extraImages.length > 0 ? extraImages.map((i) => i.dataUrl) : (product?.extraImages ?? []),
 };

 const stored = JSON.parse(sessionStorage.getItem('new_products') || '[]');
 const idx = stored.findIndex((p: Product) => p.id === updated.id);
 if (idx >= 0) stored[idx] = updated;
 else initialProducts[initialProducts.findIndex((p) => p.id === updated.id)] = updated;
 sessionStorage.setItem('new_products', JSON.stringify(stored));

 toast('Product updated successfully');
 setSaving(false);
 router.push('/admin/products');
 }, 400);
 };

 const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
 setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
 };

 const addVariant = () => {
 setVariants((prev) => [...prev, {
 id: crypto.randomUUID(),
 productId: product?.id ?? params.id as string,
 size: 'M',
 color: '',
 sku: '',
 stockQuantity: 0,
 }]);
 };

 const removeVariant = (id: string) => {
 setVariants((prev) => prev.filter((v) => v.id !== id));
 };

 if (!product) {
 return (
 <div className="flex items-center justify-center h-64">
 <p className="text-neutral-500">Product not found</p>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors">
 <ArrowLeft className="w-5 h-5" />
 </button>
 <div>
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
 Edit &ldquo;{product?.name}&rdquo;
 </h1>
 <p className="text-sm text-neutral-500 mt-1">Manage product details, images, and variants</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <Link
 href={`/admin/products/${params.id}`}
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
 <div className="grid grid-cols-2 gap-4">
 <Field label="Slug" required error={errors.slug}>
 <div className="relative">
 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">/</span>
 <input
 type="text"
 value={slug}
 onChange={(e) => setSlug(e.target.value)}
 onBlur={() => setTouched((p) => ({ ...p, slug: true }))}
 placeholder="classic-navy-polo"
 className={cn(getInputClass(errors.slug), 'pl-5')}
 />
 </div>
 </Field>
 <Field label="Category">
 <select
 value={category}
 onChange={(e) => setCategory(e.target.value as 'tshirt' | 'polo')}
 className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors"
 >
 <option value="tshirt">T-Shirt</option>
 <option value="polo">Polo</option>
 </select>
 </Field>
 </div>
 <Field label="Description">
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Product description..."
 rows={4}
 className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors resize-none placeholder:text-neutral-400"
 />
 </Field>
 </Card>
 )}

 {activeTab === 'images' && (
 <Card className="p-6 space-y-6">
 <CardTitle>Product Images</CardTitle>
 <ImageDropzone images={heroImages} onChange={setHeroImages} maxImages={1} label="Hero Image" />
 {product?.heroImage && heroImages.length === 0 && (
 <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-100 border border-border">
 <Image src={product.heroImage} alt={product.name} fill className="object-cover" />
 <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
 Current hero image
 </div>
 </div>
 )}
 <ImageDropzone images={extraImages} onChange={setExtraImages} maxImages={6} label="Extra Images" />
 {product?.extraImages && product.extraImages.length > 0 && extraImages.length === 0 && (
 <div className="grid grid-cols-4 gap-3">
 {product.extraImages.map((img, i) => (
 <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-border">
 <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
 </div>
 ))}
 </div>
 )}
 </Card>
 )}

 {activeTab === 'variants' && (
 <Card className="p-6 space-y-5">
 <div className="flex items-center justify-between">
 <CardTitle>Variants</CardTitle>
 <button
 onClick={addVariant}
 className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-neutral-100 transition-colors"
 >
 <Plus className="w-3.5 h-3.5" /> Add Variant
 </button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider border-b border-border">
 <th className="pb-3 font-medium">Size</th>
 <th className="pb-3 font-medium">Color</th>
 <th className="pb-3 font-medium">SKU</th>
 <th className="pb-3 font-medium text-right">Stock</th>
 <th className="pb-3 w-10"></th>
 </tr>
 </thead>
 <tbody>
 {variants.map((v) => (
 <tr key={v.id} className="border-b border-border/50">
 <td className="py-2 pr-2">
 <select
 value={v.size}
 onChange={(e) => updateVariant(v.id, 'size', e.target.value)}
 className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors"
 >
 {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
 </select>
 </td>
 <td className="py-2 px-2">
 <input
 type="text"
 value={v.color}
 onChange={(e) => updateVariant(v.id, 'color', e.target.value)}
 placeholder="Navy"
 className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors"
 />
 </td>
 <td className="py-2 px-2">
 <input
 type="text"
 value={v.sku}
 onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
 placeholder="POL-NVY-M"
 className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors font-mono text-xs"
 />
 </td>
 <td className="py-2 pl-2">
 <input
 type="number"
 value={v.stockQuantity}
 onChange={(e) => updateVariant(v.id, 'stockQuantity', Number(e.target.value))}
 min={0}
 className="w-20 px-3 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-neutral-900 transition-colors text-right"
 />
 </td>
 <td className="py-2">
 <button
 onClick={() => removeVariant(v.id)}
 className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 {variants.length === 0 && (
 <tr>
 <td colSpan={5} className="py-12 text-center text-sm text-neutral-500">No variants added yet</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
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
 <span className="font-medium">{categoryLabels[category]}</span>
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
 onClick={() => router.back()}
 className="w-full px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
 >
 Cancel
 </button>
 </div>
 </Card>

 <Card className="p-5 bg-yellow-50 border-yellow-200 ">
 <div className="flex gap-2">
 <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
 <div>
 <p className="text-sm font-medium text-yellow-800 ">Draft Mode</p>
 <p className="text-xs text-yellow-700 mt-0.5">Changes are saved to your browser session and will be lost on cache clear.</p>
 </div>
 </div>
 </Card>
 </div>
 </div>
 </div>
 );
}
