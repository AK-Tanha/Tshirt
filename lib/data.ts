import { Product, ProductVariant } from './types';

export const products: Product[] = [
  { id: 'p1', slug: 'classic-navy-polo', name: 'Classic Navy Polo', description: 'Timeless polo for everyday wear.', category: 'polo', price: 850, images: ['https://picsum.photos/seed/polo1/400/400'] },
  { id: 'p2', slug: 'white-slim-fit-polo', name: 'White Slim Fit Polo', description: 'Crisp and comfortable.', category: 'polo', price: 950, images: ['https://picsum.photos/seed/polo2/400/400'] },
  { id: 'p3', slug: 'black-premium-polo', name: 'Black Premium Polo', description: 'Superior cotton quality.', category: 'polo', price: 1200, images: ['https://picsum.photos/seed/polo3/400/400'] },
  { id: 't1', slug: 'grey-basic-tee', name: 'Grey Basic Tee', description: 'Softest cotton.', category: 'tshirt', price: 550, images: ['https://picsum.photos/seed/tee1/400/400'] },
  { id: 't2', slug: 'olive-crew-neck', name: 'Olive Crew Neck', description: 'Earth tone perfection.', category: 'tshirt', price: 650, images: ['https://picsum.photos/seed/tee2/400/400'] },
  { id: 't3', slug: 'charcoal-v-neck', name: 'Charcoal V-Neck', description: 'Modern silhouette.', category: 'tshirt', price: 600, images: ['https://picsum.photos/seed/tee3/400/400'] },
];

export const variants: ProductVariant[] = [
  { id: 'v1', productId: 'p1', size: 'M', color: 'Navy', sku: 'POL-NVY-M', stockQuantity: 10 },
  { id: 'v2', productId: 'p1', size: 'L', color: 'Navy', sku: 'POL-NVY-L', stockQuantity: 5 },
  // ... add more as needed
];
