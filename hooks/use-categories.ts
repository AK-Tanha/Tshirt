import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategory } from '@/lib/api/categories';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // categories change rarely — cache for 10 min
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
}