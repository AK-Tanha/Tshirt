import { Product, ProductVariant, Supplier } from './types';

export const products: Product[] = [
 { id: 'p1', slug: 'classic-navy-polo', name: 'Classic Navy Polo', description: 'Timeless polo for everyday wear.', category: 'polo', price: 850, heroImage: 'https://picsum.photos/seed/polo1/800/800', extraImages: ['https://picsum.photos/seed/polo1a/400/400', 'https://picsum.photos/seed/polo1b/400/400'], supplierId: 'sup_001' },
 { id: 'p2', slug: 'white-slim-fit-polo', name: 'White Slim Fit Polo', description: 'Crisp and comfortable.', category: 'polo', price: 950, heroImage: 'https://picsum.photos/seed/polo2/800/800', extraImages: ['https://picsum.photos/seed/polo2a/400/400', 'https://picsum.photos/seed/polo2b/400/400'], supplierId: 'sup_001' },
 { id: 'p3', slug: 'black-premium-polo', name: 'Black Premium Polo', description: 'Superior cotton quality.', category: 'polo', price: 1200, heroImage: 'https://picsum.photos/seed/polo3/800/800', extraImages: ['https://picsum.photos/seed/polo3a/400/400', 'https://picsum.photos/seed/polo3b/400/400'], supplierId: 'sup_003' },
 { id: 't1', slug: 'grey-basic-tee', name: 'Grey Basic Tee', description: 'Softest cotton.', category: 'tshirt', price: 550, heroImage: 'https://picsum.photos/seed/tee1/800/800', extraImages: ['https://picsum.photos/seed/tee1a/400/400', 'https://picsum.photos/seed/tee1b/400/400'], supplierId: 'sup_002' },
 { id: 't2', slug: 'olive-crew-neck', name: 'Olive Crew Neck', description: 'Earth tone perfection.', category: 'tshirt', price: 650, heroImage: 'https://picsum.photos/seed/tee2/800/800', extraImages: ['https://picsum.photos/seed/tee2a/400/400', 'https://picsum.photos/seed/tee2b/400/400'], supplierId: 'sup_002' },
 { id: 't3', slug: 'charcoal-v-neck', name: 'Charcoal V-Neck', description: 'Modern silhouette.', category: 'tshirt', price: 600, heroImage: 'https://picsum.photos/seed/tee3/800/800', extraImages: ['https://picsum.photos/seed/tee3a/400/400', 'https://picsum.photos/seed/tee3b/400/400'], supplierId: 'sup_004' },
];

export const suppliers: Supplier[] = [
 { id: 'sup_001', name: 'TexPrime Garments', contactPerson: 'Abdur Rahman', email: 'rahman@texprime.com', phone: '01711111111', address: '42 Gazipur Industrial Zone, Gazipur', status: 'active', supplyCategories: ['polo'], createdAt: '2025-01-15T09:00:00Z' },
 { id: 'sup_002', name: 'CottonKing Ltd.', contactPerson: 'Farzana Hussain', email: 'farzana@cottonking.com', phone: '01722222222', address: '78 Narayanganj BSCIC, Narayanganj', status: 'active', supplyCategories: ['tshirt'], createdAt: '2025-02-01T10:30:00Z' },
 { id: 'sup_003', name: 'StitchCraft BD', contactPerson: 'Mizanur Rahman', email: 'mizan@stitchcraft.com', phone: '01733333333', address: '15 Savar EPZ, Savar', status: 'active', supplyCategories: ['polo'], createdAt: '2025-03-10T08:00:00Z' },
 { id: 'sup_004', name: 'Dhaka Wear Industries', contactPerson: 'Shamima Akhter', email: 'shamima@dhakawear.com', phone: '01744444444', address: '23 Tejgaon Industrial Area, Dhaka', status: 'inactive', supplyCategories: ['tshirt'], createdAt: '2025-04-20T11:00:00Z' },
];

export const variants: ProductVariant[] = [
 { id: 'v1', productId: 'p1', size: 'S', color: 'Navy', sku: 'POL-NVY-S', stockQuantity: 8,  },
 { id: 'v2', productId: 'p1', size: 'M', color: 'Navy', sku: 'POL-NVY-M', stockQuantity: 10 },
 { id: 'v3', productId: 'p1', size: 'L', color: 'Navy', sku: 'POL-NVY-L', stockQuantity: 5 },
 { id: 'v4', productId: 'p1', size: 'XL', color: 'Navy', sku: 'POL-NVY-XL', stockQuantity: 3 },
 { id: 'v5', productId: 'p2', size: 'S', color: 'White', sku: 'POL-WHT-S', stockQuantity: 12 },
 { id: 'v6', productId: 'p2', size: 'M', color: 'White', sku: 'POL-WHT-M', stockQuantity: 15 },
 { id: 'v7', productId: 'p2', size: 'L', color: 'White', sku: 'POL-WHT-L', stockQuantity: 7 },
 { id: 'v8', productId: 'p2', size: 'XL', color: 'White', sku: 'POL-WHT-XL', stockQuantity: 0 },
 { id: 'v9', productId: 'p3', size: 'M', color: 'Black', sku: 'POL-BLK-M', stockQuantity: 6 },
 { id: 'v10', productId: 'p3', size: 'L', color: 'Black', sku: 'POL-BLK-L', stockQuantity: 4 },
 { id: 'v11', productId: 'p3', size: 'XL', color: 'Black', sku: 'POL-BLK-XL', stockQuantity: 2 },
 { id: 'v12', productId: 'p3', size: 'XXL', color: 'Black', sku: 'POL-BLK-XXL', stockQuantity: 1 },
 { id: 'v13', productId: 't1', size: 'S', color: 'Grey', sku: 'TEE-GRY-S', stockQuantity: 20 },
 { id: 'v14', productId: 't1', size: 'M', color: 'Grey', sku: 'TEE-GRY-M', stockQuantity: 25 },
 { id: 'v15', productId: 't1', size: 'L', color: 'Grey', sku: 'TEE-GRY-L', stockQuantity: 18 },
 { id: 'v16', productId: 't1', size: 'XL', color: 'Grey', sku: 'TEE-GRY-XL', stockQuantity: 9 },
 { id: 'v17', productId: 't2', size: 'S', color: 'Olive', sku: 'TEE-OLV-S', stockQuantity: 14 },
 { id: 'v18', productId: 't2', size: 'M', color: 'Olive', sku: 'TEE-OLV-M', stockQuantity: 11 },
 { id: 'v19', productId: 't2', size: 'L', color: 'Olive', sku: 'TEE-OLV-L', stockQuantity: 6 },
 { id: 'v20', productId: 't2', size: 'XL', color: 'Olive', sku: 'TEE-OLV-XL', stockQuantity: 3 },
 { id: 'v21', productId: 't3', size: 'S', color: 'Charcoal', sku: 'TEE-CHR-S', stockQuantity: 16 },
 { id: 'v22', productId: 't3', size: 'M', color: 'Charcoal', sku: 'TEE-CHR-M', stockQuantity: 22 },
 { id: 'v23', productId: 't3', size: 'L', color: 'Charcoal', sku: 'TEE-CHR-L', stockQuantity: 13 },
 { id: 'v24', productId: 't3', size: 'XL', color: 'Charcoal', sku: 'TEE-CHR-XL', stockQuantity: 0 },
];
