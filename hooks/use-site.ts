import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSite, updateSite } from '@/lib/api/site';
import type { UpdateSitePayload } from '@/lib/types';

export function useSite() {
  return useQuery({
    queryKey: ['site'],
    queryFn: getSite,
  });
}

export function useUpdateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSitePayload) => updateSite(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site'] }),
  });
}