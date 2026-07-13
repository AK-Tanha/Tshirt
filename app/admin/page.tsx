'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { adminStats, recentOrders, revenueByMonth, topProducts, categoryBreakdown } from '@/lib/admin-data';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
 TrendingUp, DollarSign, ShoppingCart, Package,
 Clock, Users, AlertTriangle, Eye, ArrowUpRight,
} from 'lucide-react';

const statusBadge: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
 pending_confirmation: 'warning',
 confirmed: 'info',
 shipped: 'neutral',
 delivered: 'success',
 returned: 'danger',
};

const statusLabels: Record<string, string> = {
 pending_confirmation: 'Pending',
 confirmed: 'Confirmed',
 shipped: 'Shipped',
 delivered: 'Delivered',
 returned: 'Returned',
};

export default function AdminDashboard() {
 const displayOrders = recentOrders.slice(0, 5);
 const maxRevenue = Math.max(...revenueByMonth.map(r => r.revenue));
 const totalRevenue = revenueByMonth.reduce((s, r) => s + r.revenue, 0);

 const kpis = [
 { title: 'Revenue Today', value: '৳12,450', change: 12.5, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600 ' },
 { title: 'Revenue This Month', value: `৳${totalRevenue.toLocaleString()}`, change: 8.3, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600 ' },
 { title: 'Orders Today', value: '24', change: 15.2, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600 ' },
 { title: 'Pending Orders', value: adminStats.pendingOrders.toString(), change: -2.1, icon: Clock, color: 'bg-amber-100 text-amber-600 ' },
 { title: 'Completed Orders', value: '98', change: 6.7, icon: Package, color: 'bg-emerald-100 text-emerald-600 ' },
 { title: 'New Customers', value: '32', change: 18.5, icon: Users, color: 'bg-purple-100 text-purple-600 ' },
 { title: 'Total Products', value: adminStats.totalProducts.toString(), change: 0, icon: Package, color: 'bg-neutral-100 text-neutral-600 ' },
 { title: 'Low Stock Items', value: '4', change: -5.0, icon: AlertTriangle, color: 'bg-red-100 text-red-600 ' },
 ];

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
 <p className="text-sm text-neutral-500 mt-1">Your store at a glance</p>
 </div>
 <span className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg font-mono">FY 2026</span>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {kpis.map((kpi, i) => (
 <KPICard key={kpi.title} {...kpi} index={i} />
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <Card className="lg:col-span-2 p-6">
 <CardHeader>
 <div>
 <CardTitle>Revenue Overview</CardTitle>
 <p className="text-[11px] text-neutral-500 mt-0.5">Monthly revenue for fiscal year 2026</p>
 </div>
 <span className="text-xs text-neutral-500 font-mono">Total: ৳{totalRevenue.toLocaleString()}</span>
 </CardHeader>
 <div className="overflow-x-auto -mx-6 px-6">
 <div className="flex items-end gap-2 h-48 min-w-[480px]">
 {revenueByMonth.map((item, idx) => (
 <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 group">
 <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-all font-mono bg-neutral-100 px-1.5 py-0.5 rounded -mt-6">
 ৳{item.revenue.toLocaleString()}
 </span>
 <div className="w-full relative flex-1 flex items-end">
 <div
 className="w-full rounded-sm cursor-pointer transition-all duration-300 "
 style={{
 height: `${(item.revenue / maxRevenue) * 100}%`,
 minHeight: '8px',
 background: 'linear-gradient(to top, rgb(10,10,10) 0%, rgb(64,64,64) 100%)',
 }}
 />
 </div>
 <span className={cn('text-[10px] font-medium', idx === revenueByMonth.length - 1 ? 'text-neutral-900 ' : 'text-neutral-500')}>
 {item.month}
 </span>
 </div>
 ))}
 </div>
 </div>
 <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-[11px] text-neutral-500">
 <span>Highest: ৳{maxRevenue.toLocaleString()} ({revenueByMonth.find(r => r.revenue === maxRevenue)?.month})</span>
 <span className="flex items-center gap-1">
 <TrendingUp className="w-3 h-3 text-emerald-600" />
 <span className="text-emerald-600 font-medium">+12.5%</span> vs last year
 </span>
 </div>
 </Card>

 <Card className="p-6">
 <CardHeader>
 <CardTitle>Category Breakdown</CardTitle>
 </CardHeader>
 <div className="space-y-5">
 {categoryBreakdown.map((cat) => (
 <div key={cat.category}>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium">{cat.category}</span>
 <span className="text-sm font-mono text-neutral-500">৳{cat.revenue.toLocaleString()}</span>
 </div>
 <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
 <div className="h-full bg-neutral-900 rounded-full transition-all" style={{ width: `${cat.percentage}%` }} />
 </div>
 <div className="flex justify-between mt-1">
 <span className="text-[11px] text-neutral-500">{cat.count} products</span>
 <span className="text-[11px] text-neutral-500">{cat.percentage}% of revenue</span>
 </div>
 </div>
 ))}
 </div>
 <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mt-4">
 View all products <ArrowUpRight className="w-3 h-3" />
 </Link>
 </Card>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <Card className="lg:col-span-2" padding={false}>
 <div className="flex items-center justify-between p-6 border-b border-border">
 <CardTitle>Recent Orders</CardTitle>
 <Link href="/admin/orders" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
 View all <ArrowUpRight className="w-3 h-3" />
 </Link>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider">
 <th className="p-4 font-medium">Order</th>
 <th className="p-4 font-medium">Customer</th>
 <th className="p-4 font-medium hidden sm:table-cell">Items</th>
 <th className="p-4 font-medium">Total</th>
 <th className="p-4 font-medium">Status</th>
 <th className="p-4 font-medium hidden md:table-cell">Date</th>
 </tr>
 </thead>
 <tbody>
 {displayOrders.map((order) => (
 <tr key={order.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
 <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
 <td className="p-4 font-medium">{order.customerName}</td>
 <td className="p-4 text-neutral-500 hidden sm:table-cell">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
 <td className="p-4 font-mono">৳{order.totalAmount.toLocaleString()}</td>
 <td className="p-4"><Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge></td>
 <td className="p-4 text-neutral-500 text-xs hidden md:table-cell">
 {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>

 <Card className="p-6">
 <CardHeader>
 <CardTitle>Top Products</CardTitle>
 </CardHeader>
 <div className="space-y-4">
 {topProducts.map((product, i) => (
 <div key={product.name} className="flex items-center justify-between">
 <div className="flex items-center gap-3 min-w-0">
 <span className={cn(
 'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0',
 i === 0 ? 'bg-neutral-900 text-white ' : 'bg-neutral-100 text-neutral-500',
 )}>
 {i + 1}
 </span>
 <span className="text-sm font-medium truncate">{product.name}</span>
 </div>
 <span className="text-sm font-mono text-neutral-500 shrink-0 ml-3">৳{product.revenue.toLocaleString()}</span>
 </div>
 ))}
 </div>
 <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mt-4">
 View all products <ArrowUpRight className="w-3 h-3" />
 </Link>
 </Card>
 </div>
 </div>
 );
}
