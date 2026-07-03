export type Category = 'polo' | 'tshirt';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  images: string[];
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
  variantId: string;
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
