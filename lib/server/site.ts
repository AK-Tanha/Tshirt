import { cache } from 'react';
import type { SiteSettings } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DEFAULT_SITE: SiteSettings = {
  id: 'default',
  siteName: 'APAN Apparel',
  logoUrl: null,
  description:
    'Premium Polos, T-Shirts, Activewear, and Kids Wear for the modern Bangladeshi.',
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!API_URL) return DEFAULT_SITE;
  try {
    const res = await fetch(`${API_URL}/site`, { next: { revalidate: 300 } });
    if (!res.ok) return DEFAULT_SITE;
    const json = await res.json();
    return json?.data ?? DEFAULT_SITE;
  } catch {
    return DEFAULT_SITE;
  }
});
