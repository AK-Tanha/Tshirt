'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { adminStats, recentOrders, revenueByMonth, topProducts, categoryBreakdown } from '@/lib/admin-data';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Package, Clock, ArrowUpRight, Eye,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending_confirmation: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  returned: 'bg-red-100 text-red-700',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <span className="text-xs text-muted font-mono">Last 30 days</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`৳${adminStats.totalRevenue.toLocaleString()}`} change={adminStats.revenueGrowth} icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard title="Total Orders" value={adminStats.totalOrders.toString()} change={adminStats.orderGrowth} icon={ShoppingCart} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Total Products" value={adminStats.totalProducts.toString()} change={adminStats.productGrowth} icon={Package} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Pending Orders" value={adminStats.pendingOrders.toString()} change={adminStats.pendingGrowth} icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Revenue (YTD)</p>
              <p className="font-display text-xl font-bold">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" /> 12.5% vs last year
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Total Orders</p>
              <p className="font-display text-xl font-bold">{adminStats.totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" /> 8.3% vs last year
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Avg Order Value</p>
              <p className="font-display text-xl font-bold">৳{Math.round(totalRevenue / adminStats.totalOrders).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" /> 3.8% vs last year
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-base font-semibold">Revenue Overview</h2>
            <select className="text-xs text-muted bg-transparent border border-border rounded-lg px-2 py-1 outline-none focus:border-black transition-colors">
              <option>This Year</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex items-end gap-3 h-40 min-w-[480px]">
              {revenueByMonth.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity font-mono">৳{item.revenue}</span>
                  <div
                    className="w-full rounded-md bg-black/80 group-hover:bg-black transition-colors cursor-pointer"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: '6px' }}
                  />
                  <span className="text-[10px] text-muted">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4">Category Breakdown</h2>
          <div className="space-y-5">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm font-mono text-muted">৳{cat.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-stone rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full transition-all" style={{ width: `${cat.percentage}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-muted">{cat.count} products</span>
                  <span className="text-[11px] text-muted">{cat.percentage}% of revenue</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-muted hover:text-black transition-colors mt-4">
            View all products <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-display text-base font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-muted hover:text-black transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted uppercase tracking-wider">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border text-sm hover:bg-stone/50 transition-colors">
                    <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4 text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="p-4 font-mono">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColors[order.status])}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4 text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</td>
                    <td className="p-4">
                      <Link href="/admin/orders" className="text-muted hover:text-black transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {displayOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">#{order.id.slice(0, 8)}</span>
                  <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColors[order.status])}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{order.customerName}</span>
                  <span className="text-sm font-mono">৳{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0",
                    i === 0 ? "bg-black text-white" : "bg-stone text-muted",
                  )}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium truncate">{product.name}</span>
                </div>
                <span className="text-sm font-mono text-muted shrink-0 ml-3">৳{product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-muted hover:text-black transition-colors mt-4">
            View all products <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: {
  title: string; value: string; change: number; icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border p-4 md:p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", change >= 0 ? "text-emerald-600" : "text-red-600")}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted mt-0.5">{title}</p>
    </motion.div>
  );
}
