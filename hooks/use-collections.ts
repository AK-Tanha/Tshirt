import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from '@/lib/api/collections';
import type { CreateCollectionPayload } from '@/lib/types';

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 10, // collections change rarely — cache for 10 min
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollection(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) => createCollection(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCollectionPayload>;
    }) => updateCollection(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['collections'] }),
  });
}
