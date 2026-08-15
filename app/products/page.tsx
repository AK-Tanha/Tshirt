import type { Metadata } from 'next';
import { ProductsPageClient } from './ProductsPageClient';
import { getCollections } from '@/lib/api/collections';
import { getCategories } from '@/lib/api/categories';
import { getProducts } from '@/lib/api/products';
import { absoluteUrl, socialMetadata } from '@/lib/server/seo';
import { getHeroImage } from '@/lib/utils';

const PAGE_DESCRIPTION =
  'Shop premium polos, t-shirts, activewear and kids wear. Free delivery in Dhaka, 7-day easy exchange, quality guaranteed.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  let title = 'Shop All Products';
  let description = PAGE_DESCRIPTION;
  let image: string | undefined;

  if (params.collection) {
    const collections = await getCollections().catch(() => []);
    const collection = collections.find((c) => c.slug === params.collection);
    if (collection) {
      title = collection.name;
      description = collection.description ?? PAGE_DESCRIPTION;
      image = collection.image ?? undefined;
    }
  } else if (params.category) {
    const categories = await getCategories().catch(() => []);
    const category = categories.find((c) => c.slug === params.category);
    if (category) {
      title = category.name;
      description = PAGE_DESCRIPTION;
    }
  }

  const url = absoluteUrl('/products');

  const social = await socialMetadata({
    title,
    description,
    url,
    images: image ? [image] : [],
  });

  return {
    title,
    description,
    alternates: { canonical: '/products' },
    ...social,
  };
}

export default async function ProductsPage() {
  let items: { name: string; url: string; image?: string }[] = [];
  try {
    const { data: products } = await getProducts({ limit: 24 });
    items = products.map((p) => ({
      name: p.name,
      url: absoluteUrl(`/products/${p.id}`),
      image: getHeroImage(p.images)?.url,
    }));
  } catch {
    // sitemap structured data is best-effort — never block the page render
  }

  return (
    <>
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Shop',
              description: PAGE_DESCRIPTION,
              url: absoluteUrl('/products'),
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: items.map((item, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: item.name,
                  url: item.url,
                  image: item.image,
                })),
              },
            }),
          }}
        />
      )}
      <ProductsPageClient />
    </>
  );
}
