import type { Metadata } from 'next';
import { getSiteSettings } from './site';

/**
 * Resolves the canonical origin for the storefront.
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_SITE_URL (explicit override)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (Vercel production domain)
 *   3. Hardcoded production default
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`.replace(/\/+$/, '');

  return 'https://apanapparel.com';
}

export function absoluteUrl(path = ''): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/**
 * Shared social metadata (Open Graph + Twitter) used across storefront pages.
 * Requires a resolved site logo for the og:image fallback.
 */
export async function socialMetadata({
  title,
  description,
  url,
  images,
}: {
  title: string;
  description: string;
  url: string;
  images?: string[];
}): Promise<Metadata> {
  const site = await getSiteSettings();
  const siteName = site.siteName;
  const ogImages = images && images.length > 0 ? images : site.logoUrl ? [site.logoUrl] : [];

  return {
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: 'en_US',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages,
    },
  };
}
