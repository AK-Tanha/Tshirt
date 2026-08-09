import { apiFetch } from '../api-client';
import { Collection, CreateCollectionPayload } from '../types';

export function getCollections() {
  return apiFetch<Collection[]>('/collections');
}

export function getCollection(id: string) {
  return apiFetch<Collection>(`/collections/${id}`);
}

export function createCollection(payload: CreateCollectionPayload) {
  return apiFetch<Collection>('/collections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCollection(
  id: string,
  payload: Partial<CreateCollectionPayload>,
) {
  return apiFetch<Collection>(`/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteCollection(id: string) {
  return apiFetch<Collection>(`/collections/${id}`, { method: 'DELETE' });
}
