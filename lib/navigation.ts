import {
 LayoutDashboard, ShoppingBag, Package, ClipboardList, Users,
 Tag, Percent, CreditCard, Truck, Layout, BarChart3,
 Shield, LifeBuoy, Settings, Store,
} from 'lucide-react';
import type { ElementType } from 'react';

export interface NavItem {
 href?: string;
 label: string;
 icon: ElementType;
 children?: { href: string; label: string }[];
}

export const navItems: NavItem[] = [
 { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
 {
 label: 'Catalog', icon: ShoppingBag,
 children: [
 { href: '/admin/products', label: 'Products' },
 { href: '/admin/catalog/categories', label: 'Categories' },
 { href: '/admin/catalog/brands', label: 'Brands' },
 { href: '/admin/catalog/collections', label: 'Collections' },
 ],
 },
 {
 label: 'Inventory', icon: Package,
 children: [
 { href: '/admin/inventory', label: 'Stock' },
 { href: '/admin/inventory/suppliers', label: 'Suppliers' },
 { href: '/admin/inventory/purchase-orders', label: 'Purchase Orders' },
 ],
 },
{
  label: 'Orders', icon: ClipboardList,
  children: [
  { href: '/admin/orders', label: 'All Orders' },
  { href: '/admin/orders/create', label: 'Create Order' },
  ],
  },
 {
 label: 'Customers', icon: Users,
 children: [
 { href: '/admin/customers', label: 'Customer List' },
 { href: '/admin/customers/groups', label: 'Groups' },
 { href: '/admin/customers/reviews', label: 'Reviews' },
 ],
 },
 {
 label: 'Marketing', icon: Tag,
 children: [
 { href: '/admin/marketing/coupons', label: 'Coupons' },
 { href: '/admin/marketing/discounts', label: 'Discounts' },
 { href: '/admin/marketing/flash-sales', label: 'Flash Sales' },
 ],
 },
 { label: 'Payments', icon: CreditCard, children: [
 { href: '/admin/payments', label: 'Transactions' },
 { href: '/admin/payments/methods', label: 'Payment Methods' },
 ]},
 { label: 'Shipping', icon: Truck, children: [
 { href: '/admin/shipping/zones', label: 'Shipping Zones' },
 { href: '/admin/shipping/methods', label: 'Shipping Methods' },
 ]},
 { label: 'CMS', icon: Layout, children: [
 { href: '/admin/cms/banner', label: 'Banner' },
 { href: '/admin/cms/blog', label: 'Blog' },
 { href: '/admin/cms/pages', label: 'Pages' },
 ]},
 {
 label: 'Reports', icon: BarChart3,
 children: [
 { href: '/admin/reports/sales', label: 'Sales' },
 { href: '/admin/reports/revenue', label: 'Revenue' },
 { href: '/admin/reports/inventory', label: 'Inventory' },
 ],
 },
 { href: '/admin/users', label: 'Users', icon: Shield },
 { href: '/admin/support', label: 'Support', icon: LifeBuoy },
 { href: '/admin/settings', label: 'Settings', icon: Settings },
];
