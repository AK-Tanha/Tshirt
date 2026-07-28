//export type Category = 'polo' | 'tshirt';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: string | null; // Prisma Decimal serializes as string over JSON
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  supplierId: string | null;
  lotNumber: string | null;
  isActive: boolean;
  createdAt: string;
  category: Category;
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
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface Supplier {
 id: string;
 name: string;
 contactPerson: string;
 email: string;
 phone: string;
 address: string;
 status: 'active' | 'inactive';
 supplyCategories: string[];
 createdAt: string;
}

export interface ProductVariant {
 id: string;
 productId: string;
 //size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
 color: string;
 sku: string;
 stockQuantity: number;
}

export interface CartItem {
 productId: string;
 quantity: number;
}

export interface Order {
 id: string;
 customerName: string;
 phone: string;
 address: string;
 items: CartItem[];
 totalAmount: number;
 paymentMethod: 'cod';
 status: 'pending_confirmation' | 'confirmed' | 'shipped' | 'delivered' | 'returned';
 createdAt: string;
}

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