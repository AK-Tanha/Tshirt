import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { StickyAddToCart } from '@/components/StickyAddToCart';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { getProduct } from '@/lib/api/products';
import { getHeroImage } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { absoluteUrl, socialMetadata } from '@/lib/server/seo';

async function fetchProductSafe(id: string) {
  try {
    return await getProduct(id);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err; // let genuine server errors surface, don't silently 404 on 500s
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductSafe(id);
  if (!product || !product.isActive) return {};
  const hero = getHeroImage(product.images);
  const url = absoluteUrl(`/products/${product.id}`);

  const social = await socialMetadata({
    title: product.name,
    description: product.description || product.name,
    url,
    images: hero ? [hero.url] : [],
  });

  return {
    title: product.name,
    description: product.description || undefined,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      ...social.openGraph,
      url,
      title: product.name,
      description: product.description || product.name,
      images: hero ? [hero.url] : [],
      ...(product.brand?.name
        ? { 'product:brand': product.brand.name }
        : {}),
    },
    twitter: social.twitter,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductSafe(id);
  if (!product || !product.isActive) notFound();

  const hero = getHeroImage(product.images);
  const url = absoluteUrl(`/products/${product.id}`);
  const inStock =
    product.variants?.some((v) => Number(v.stock) > 0) ?? false;
  const lowestPrice = product.variants?.reduce(
    (min, v) =>
      v.price != null && Number(v.price) < min ? Number(v.price) : min,
    Number(product.basePrice),
  );

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: absoluteUrl('/products'),
      },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  };

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url,
    name: product.name,
    url,
    sku: product.id,
    description: product.description ?? undefined,
    image: product.images?.map((img) => img.url) ?? [],
    ...(product.brand?.name ? { brand: { '@type': 'Brand', name: product.brand.name } } : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BDT',
      price: String(lowestPrice),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="px-page max-w-7xl mx-auto pb-28 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <ProductDetailClient product={product} />
      <StickyAddToCart product={product} />
    </main>
  );
}