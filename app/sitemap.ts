import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';
import { getCollections } from '@/lib/api/collections';
import { absoluteUrl } from '@/lib/server/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/products'), changeFrequency: 'daily', priority: 0.9 },
  ];

  const [products, categories, collections] = await Promise.all([
    getProducts({ limit: 5000 }).catch(() => null),
    getCategories().catch(() => []),
    getCollections().catch(() => []),
  ]);

  const productRoutes: MetadataRoute.Sitemap =
    products?.data
      .filter((p) => p.isActive)
      .map((p) => ({
        url: absoluteUrl(`/products/${p.id}`),
        lastModified: new Date(p.createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      })) ?? [];

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => (c._count?.products ?? 0) > 0)
    .map((c) => ({
      url: absoluteUrl(`/products?category=${encodeURIComponent(c.slug)}`),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = collections
    .filter((c) => c.isActive)
    .map((c) => ({
      url: absoluteUrl(`/products?collection=${encodeURIComponent(c.slug)}`),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ];
}
