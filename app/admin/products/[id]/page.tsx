"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn, getHeroImage } from "@/lib/utils";
import { useProduct } from "@/hooks/use-products";
import { useSuppliers } from "@/hooks/use-suppliers";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Edit3, ShoppingCart, Store } from "lucide-react";

function getStockInfo(variants: { stock: number }[]): {
  label: string;
  variant: "success" | "warning" | "danger";
  total: number;
} {
  const total = variants.reduce((sum, v) => sum + v.stock, 0);
  if (total === 0) return { label: "Out of Stock", variant: "danger", total };
  if (total <= 10) return { label: "Low Stock", variant: "warning", total };
  return { label: "In Stock", variant: "success", total };
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(params.id);
  const { data: suppliers = [] } = useSuppliers();
  const [selectedImage, setSelectedImage] = useState<string>("");

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

  const stock = getStockInfo(product.variants);
  const supplier = suppliers.find((s) => s.id === product.supplierId);
  const hero = getHeroImage(product.images);
  const currentImage = selectedImage || hero?.url || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              <Badge variant={stock.variant}>{stock.label}</Badge>
            </div>
            <p className="text-sm text-neutral-500 mt-1">ID: {product.id}</p>
          </div>
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-border">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
                      No image
                    </div>
                  )}
                </div>
                {product.images.length > 0 && (
                  <div className="flex gap-2">
                    {product.images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.url)}
                        className={cn(
                          "relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors",
                          currentImage === img.url
                            ? "border-neutral-900 "
                            : "border-transparent",
                        )}
                      >
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                        {img.isHero && (
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[7px] font-mono uppercase tracking-wider text-center py-0.5">
                            Hero
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    Price
                  </p>
                  <p className="font-display text-3xl font-bold tracking-tight mt-1">
                    ৳{Number(product.basePrice).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    Description
                  </p>
                  <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                      Category
                    </p>
                    <Badge variant="neutral" className="mt-1">
                      {product.category?.name ?? "—"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                      Brand
                    </p>
                    <Badge variant="neutral" className="mt-1">
                      {product.brand?.name ?? "—"}
                    </Badge>
                  </div>
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
                    <th className="pb-3 font-medium text-right">Stock</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className="border-b border-border/50">
                      <td className="py-3 font-medium">{v.size}</td>
                      <td className="py-3 text-neutral-500">{v.color}</td>
                      <td className="py-3 text-right font-mono">{v.stock}</td>
                      <td className="py-3 text-right">
                        {v.stock === 0 ? (
                          <Badge variant="danger">Out</Badge>
                        ) : v.stock <= 5 ? (
                          <Badge variant="warning">Low</Badge>
                        ) : (
                          <Badge variant="success">OK</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {product.variants.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-sm text-neutral-500"
                      >
                        No variants configured
                      </td>
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
                <Badge variant={product.isActive ? "success" : "neutral"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Category</span>
                <span className="font-medium">
                  {product.category?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Variants</span>
                <span className="font-medium">{product.variants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Total Stock</span>
                <span className="font-mono font-medium">{stock.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Price</span>
                <span className="font-mono font-medium">
                  ৳{Number(product.basePrice).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {supplier && (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Store className="w-4 h-4 text-neutral-500" />
                </div>
                <CardTitle className="text-sm">Supplier</CardTitle>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{supplier.name}</p>
                <p className="text-xs text-neutral-500">{supplier.phone}</p>
                <Badge variant={supplier.isActive ? "success" : "neutral"}>
                  {supplier.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <CardTitle className="mb-3 text-sm">Quick Actions</CardTitle>
            <div className="space-y-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit Product
              </Link>
              <Link
                href={`/products/${product.id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
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
