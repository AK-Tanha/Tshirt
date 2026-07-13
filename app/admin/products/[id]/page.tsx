'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { products as initialProducts, variants as initialVariants, suppliers } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import type { Product, ProductVariant, Supplier } from '@/lib/types';
import {
  ArrowLeft, Edit3, Package, ShoppingCart, AlertTriangle,
  CheckCircle, XCircle, ImageIcon, Tag, Store, BarChart3,
} from 'lucide-react';

const categoryLabels: Record<string, string> = { polo: 'Polo', tshirt: 'T-Shirt' };
const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s]));

function getStockInfo(variants: ProductVariant[]): { label: string; variant: 'success' | 'warning' | 'danger'; total: number } {
  const total = variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  if (total === 0) return { label: 'Out of Stock', variant: 'danger', total };
  if (total <= 10) return { label: 'Low Stock', variant: 'warning', total };
  return { label: 'In Stock', variant: 'success', total };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('new_products') || '[]');
    const all = [...stored, ...initialProducts];
    const found = all.find((p: Product) => p.id === params.id);
    if (found) {
      setProduct(found);
      setSelectedImage(found.heroImage);
      setVariants(initialVariants.filter((v) => v.productId === found.id));
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Product not found</p>
      </div>
    );
  }

  const stock = getStockInfo(variants);
  const supplier = supplierMap[product.supplierId ?? ''] as Supplier | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
              <Badge variant={stock.variant}>{stock.label}</Badge>
            </div>
            <p className="text-sm text-neutral-500 mt-1">ID: {product.id} &middot; Slug: /{product.slug}</p>
          </div>
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-border">
                  <Image src={selectedImage} alt={product.name} fill className="object-cover" />
                </div>
                {(product.extraImages?.length ?? 0) > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedImage(product.heroImage)}
                      className={cn(
                        'relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                        selectedImage === product.heroImage ? 'border-neutral-900 dark:border-white' : 'border-transparent',
                      )}
                    >
                      <Image src={product.heroImage} alt="" fill className="object-cover" />
                    </button>
                    {product.extraImages?.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                          'relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                          selectedImage === img ? 'border-neutral-900 dark:border-white' : 'border-transparent',
                        )}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Category</p>
                  <Badge variant="neutral" className="mt-1">{categoryLabels[product.category]}</Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Price</p>
                  <p className="font-display text-3xl font-bold tracking-tight mt-1">৳{product.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Description</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Variants & Stock</CardTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider border-b border-border">
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Color</th>
                    <th className="pb-3 font-medium">SKU</th>
                    <th className="pb-3 font-medium text-right">Stock</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} className="border-b border-border/50">
                      <td className="py-3 font-medium">{v.size}</td>
                      <td className="py-3 text-neutral-500">{v.color}</td>
                      <td className="py-3 font-mono text-xs text-neutral-500">{v.sku}</td>
                      <td className="py-3 text-right font-mono">{v.stockQuantity}</td>
                      <td className="py-3 text-right">
                        {v.stockQuantity === 0 ? (
                          <Badge variant="danger">Out</Badge>
                        ) : v.stockQuantity <= 5 ? (
                          <Badge variant="warning">Low</Badge>
                        ) : (
                          <Badge variant="success">OK</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {variants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-neutral-500">No variants configured</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
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
                <span className="font-medium">{categoryLabels[product.category]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Variants</span>
                <span className="font-medium">{variants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Total Stock</span>
                <span className="font-mono font-medium">{stock.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Price</span>
                <span className="font-mono font-medium">৳{product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Slug</span>
                <span className="text-right text-xs font-mono text-neutral-500">/{product.slug}</span>
              </div>
            </div>
          </Card>

          {supplier && (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Store className="w-4 h-4 text-neutral-500" />
                </div>
                <CardTitle className="text-sm">Supplier</CardTitle>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{supplier.name}</p>
                <p className="text-xs text-neutral-500">{supplier.contactPerson}</p>
                <p className="text-xs text-neutral-500">{supplier.phone}</p>
                <Badge variant={supplier.status === 'active' ? 'success' : 'danger'}>
                  {supplier.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <CardTitle className="mb-3 text-sm">Quick Actions</CardTitle>
            <div className="space-y-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit Product
              </Link>
              <Link
                href={`/products/${product.slug}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> View on Store
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
