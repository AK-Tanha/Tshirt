import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/lib/api/products';
import { ProductQueryParams } from '@/lib/types';

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}