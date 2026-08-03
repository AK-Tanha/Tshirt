import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { StickyAddToCart } from '@/components/StickyAddToCart';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { getProduct } from '@/lib/api/products';
import { getHeroImage } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';

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
  if (!product) return {};
  const hero = getHeroImage(product.images);

  return {
    title: product.name,
    description: product.description || "",
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: hero ? [hero.url] : [],
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductSafe(id);
  if (!product) notFound();

  return (
    <main className="px-page max-w-7xl mx-auto pb-28 md:pb-32">
      <ProductDetailClient product={product} />
      <StickyAddToCart product={product} />
    </main>
  );
}