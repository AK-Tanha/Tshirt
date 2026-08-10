"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { useSuppliers } from "@/hooks/use-suppliers";
import type { Product } from "@/lib/types";
import { getHeroImage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Plus,
  Search,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";

function getStockInfo(product: Product): {
  label: string;
  variant: "success" | "warning" | "danger";
  total: number;
} {
  const total = product.variants.reduce((sum, v) => sum + v.stock, 0);
  if (total === 0) return { label: "Out of Stock", variant: "danger", total };
  if (total <= 10) return { label: "Low Stock", variant: "warning", total };
  return { label: "In Stock", variant: "success", total };
}

export default function AdminProducts() {
  const { data, isLoading } = useProducts({ limit: 100 });
  const { data: suppliers = [] } = useSuppliers();
  const deleteProduct = useDeleteProduct();
  const products = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const supplierMap = Object.fromEntries(suppliers.map((s) => [s.id, s]));

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const supplier = supplierMap[p.supplierId ?? ""];
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q) ||
      (supplier?.name.toLowerCase().includes(q) ?? false);
    const matchesSupplier =
      supplierFilter === "all" || p.supplierId === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteProduct.mutate(deletingProduct.id, {
      onSuccess: () => {
        toast(`"${deletingProduct.name}" deleted`, "error");
        setDeletingProduct(null);
      },
      onError: (err) => toast(err.message, "error"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} products
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
            />
          </div>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300 transition-all"
          >
            <option value="all">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="bg-white rounded-xl border border-border overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium hidden lg:table-cell">
                  Category
                </th>
                <th className="p-4 font-medium hidden lg:table-cell">
                  Supplier
                </th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium hidden sm:table-cell">Status</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-neutral-500">
                    Loading products...
                  </td>
                </tr>
              )}
              {filtered.map((product) => {
                const stock = getStockInfo(product);
                return (
                  <tr
                    key={product.id}
                    className="border-t border-border text-sm hover:bg-neutral-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                          {getHeroImage(product.images) && (
                            <Image
                              src={getHeroImage(product.images)!.url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-medium truncate hover:text-neutral-600 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-neutral-500 truncate">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <Badge variant="neutral">
                        {product.category?.name ?? "—"}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-neutral-500 hidden lg:table-cell">
                      {supplierMap[product.supplierId ?? ""]?.name ?? "—"}
                    </td>
                    <td className="p-4">
                      <Badge variant={stock.variant}>
                        {stock.label} ({stock.total})
                      </Badge>
                    </td>
                    <td className="p-4 font-mono font-medium">
                      ৳{Number(product.basePrice).toLocaleString()}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <Badge variant="success">
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-sm text-neutral-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {isLoading && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            Loading products...
          </div>
        )}
        {filtered.map((product) => {
          const stock = getStockInfo(product);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-border p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                  {getHeroImage(product.images) && (
                    <Image
                      src={getHeroImage(product.images)!.url}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium truncate block hover:text-neutral-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {product.category?.name ?? "No category"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-medium text-sm">
                    ৳{Number(product.basePrice).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant={product.isActive ? "success" : "neutral"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={stock.variant}>
                    {stock.label} ({stock.total})
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/products/${product.id}`}
                    aria-label="View product"
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label="Edit product"
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeletingProduct(product)}
                    aria-label="Delete product"
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            No products found
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
