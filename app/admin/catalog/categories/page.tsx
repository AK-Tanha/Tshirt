'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categories';
import { Card } from '@/components/ui/Card';
import { Search, Folder, Package } from 'lucide-react';

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const [search, setSearch] = useState('');

  const q = search.toLowerCase();
  const filtered = categories.filter(
    (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-neutral-500 mt-1">{categories.length} total categories</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">Loading categories...</p>
          </Card>
        )}
        {filtered.map((category) => (
          <Card key={category.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{category.name}</p>
                  <p className="text-xs text-neutral-500 font-mono">{category.slug}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
              <Package className="w-3.5 h-3.5" />
              {category._count?.products ?? 0} product{category._count?.products !== 1 ? 's' : ''}
            </div>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Card className="p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-neutral-500 text-sm">No categories found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
