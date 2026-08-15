import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/server/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/cart',
        '/checkout',
        '/login',
        '/register',
        '/api/',
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
