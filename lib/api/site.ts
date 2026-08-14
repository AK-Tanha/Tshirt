import { apiFetch } from '@/lib/api-client';
import type { SiteSettings, UpdateSitePayload } from '@/lib/types';

export function getSite(): Promise<SiteSettings> {
  return apiFetch('/site');
}

export function updateSite(payload: UpdateSitePayload): Promise<SiteSettings> {
  return apiFetch('/site', { method: 'PATCH', body: JSON.stringify(payload) });
}