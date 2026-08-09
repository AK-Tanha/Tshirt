// ============================================================================
// Types aligned with the Apan-Backend (NestJS + Prisma) API contract.
// All Decimal fields (basePrice, price, totalAmount, etc.) serialize as strings.
// ============================================================================

// ----------------------------------------------------------------------------
// Auth
// ----------------------------------------------------------------------------

export interface User {
  userId: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  access_token: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

// Full user record returned by the admin /users endpoints (password omitted)
export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  address: string | null;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    orders: number;
  };
  cart?: {
    id: string;
    userId: string;
    _count: { items: number };
  } | null;
  orders?: Order[];
}

// ----------------------------------------------------------------------------
// Categories
// ----------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

// ----------------------------------------------------------------------------
// Brands
// ----------------------------------------------------------------------------

export interface Brand {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
}

// ----------------------------------------------------------------------------
// Collections
// ----------------------------------------------------------------------------

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    products: number;
  };
  products?: CollectionProduct[];
}

export interface CollectionProduct {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  isActive: boolean;
  category?: { name: string } | null;
  images: { url: string; isHero?: boolean }[];
}

export interface CreateCollectionPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  productIds?: string[];
}

// ----------------------------------------------------------------------------
// Products
// ----------------------------------------------------------------------------

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: string | null; // Prisma Decimal serializes as string over JSON
  costPrice?: string | null;
  productId?: string;
  product?: Product;
}

export interface ProductImage {
  id: string;
  url: string;
  isHero?: boolean;
  productId?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: string; // Prisma Decimal serializes as string over JSON
  supplierId: string | null;
  lotNumber: string | null;
  isActive: boolean;
  createdAt: string;
  categoryId: string;
  category: Category;
  brandId: string | null;
  brand?: Brand | null;
  collections?: Collection[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  collectionId?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  basePrice: number;
  lotNumber?: string;
  categoryId: string;
  supplierId?: string;
  brandId?: string;
  collectionIds?: string[];
  imageUrls?: string[];
  heroImageUrl?: string;
  variants: {
    size: string;
    color: string;
    stock: number;
    price?: number;
  }[];
}

// ----------------------------------------------------------------------------
// Cart (server cart — auth required)
// ----------------------------------------------------------------------------

export interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

// Local (context) cart line item used before checkout
export interface LocalCartItem {
  productId: string;
  quantity: number;
}

// ----------------------------------------------------------------------------
// Orders
// ----------------------------------------------------------------------------

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  quantity: number;
  price: string; // Decimal as string
  orderId: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: string; // Decimal as string
  address: string;
  phone: string;
  createdAt: string;
  userId: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    phone: string;
    role: string;
    address: string | null;
    createdAt: string;
  };
}

export interface CreateOrderPayload {
  address: string;
  phone: string;
}

// ----------------------------------------------------------------------------
// Customers (admin)
// ----------------------------------------------------------------------------

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: string;
  _count?: {
    orders: number;
  };
  orders?: Order[];
}

// ----------------------------------------------------------------------------
// Suppliers (admin)
// ----------------------------------------------------------------------------

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    purchaseOrders: number;
  };
  purchaseOrders?: PurchaseOrder[];
}

export interface CreateSupplierPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// ----------------------------------------------------------------------------
// Purchase Orders (admin)
// ----------------------------------------------------------------------------

export type PurchaseOrderStatus =
  | 'PENDING'
  | 'ORDERED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  quantity: number;
  unitCost: string; // Decimal as string
  purchaseOrderId: string;
  variantId: string;
  variant: ProductVariant;
}

export interface PurchaseOrder {
  id: string;
  status: PurchaseOrderStatus;
  totalCost: string; // Decimal as string
  notes: string | null;
  createdAt: string;
  receivedAt: string | null;
  supplierId: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  notes?: string;
  items: {
    variantId: string;
    quantity: number;
    unitCost: number;
  }[];
}

// ----------------------------------------------------------------------------
// Invoice (admin — derived client-side)
// ----------------------------------------------------------------------------

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  invoiceNo: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  status: 'paid' | 'unpaid';
  issuedAt: string;
}
