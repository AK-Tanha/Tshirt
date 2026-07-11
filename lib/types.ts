export type Category = 'polo' | 'tshirt';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  heroImage: string;
  extraImages: string[];
  vendorId?: string;
}

export interface Vendor {
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
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
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
