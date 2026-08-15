"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAdminOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import { buildDashboard, pctChange, toNumber } from "@/lib/dashboard";
import { KPICard } from "@/components/ui/KPICard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const statusBadge: Record<string, "success" | "info" | "warning" | "danger" | "neutral"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  SHIPPED: "neutral",
  DELIVERED: "success",
  CANCELLED: "danger",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function AdminDashboard() {
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: productsRes, isLoading: productsLoading } = useProducts({ limit: 1000 });
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const loading = (ordersLoading || productsLoading || usersLoading) && orders.length === 0;
  const products = productsRes?.data ?? [];
  const d = buildDashboard(orders, products, users);

  const kpis = [
    {
      title: "Revenue Today",
      value: `৳${d.revenueToday.toLocaleString()}`,
      change: pctChange(d.revenueToday, d.revenueYesterday),
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600 ",
    },
    {
      title: "Revenue This Month",
      value: `৳${d.revenueThisMonth.toLocaleString()}`,
      change: pctChange(d.revenueThisMonth, d.revenueLastMonth),
      icon: TrendingUp,
      color: "bg-emerald-100 text-emerald-600 ",
    },
    {
      title: "Orders Today",
      value: d.ordersToday.toString(),
      change: pctChange(d.ordersToday, d.ordersYesterday),
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600 ",
    },
    {
      title: "Pending Orders",
      value: d.pendingOrders.toString(),
      icon: Clock,
      color: "bg-amber-100 text-amber-600 ",
    },
    {
      title: "Completed Orders",
      value: d.completedOrders.toString(),
      icon: Package,
      color: "bg-emerald-100 text-emerald-600 ",
    },
    {
      title: "New Customers",
      value: d.newCustomersThisMonth.toString(),
      change: pctChange(d.newCustomersThisMonth, d.newCustomersLastMonth),
      icon: Users,
      color: "bg-purple-100 text-purple-600 ",
    },
    {
      title: "Total Products",
      value: d.totalProducts.toString(),
      icon: Package,
      color: "bg-neutral-100 text-neutral-600 ",
    },
    {
      title: "Low Stock Items",
      value: d.lowStockItems.toString(),
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600 ",
    },
  ];

  const highestMonth = d.revenueByMonth.find((r) => r.revenue === d.maxRevenue);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Your store at a glance
          </p>
        </div>
        <span className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg font-mono">
          FY {new Date().getFullYear()}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-neutral-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.title} {...kpi} index={i} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <CardHeader>
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Monthly revenue for fiscal year {new Date().getFullYear()}
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              Total: ৳{d.totalYearRevenue.toLocaleString()}
            </span>
          </CardHeader>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-2 h-48 min-w-[480px]">
              {d.revenueByMonth.map((item, idx) => (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-1.5 group"
                >
                  <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-all font-mono bg-neutral-100 px-1.5 py-0.5 rounded -mt-6">
                    ৳{item.revenue.toLocaleString()}
                  </span>
                  <div className="w-full relative flex-1 flex items-end">
                    <div
                      className="w-full rounded-sm cursor-pointer transition-all duration-300 "
                      style={{
                        height: `${Math.max((item.revenue / d.maxRevenue) * 100, 1)}%`,
                        minHeight: "8px",
                        background:
                          "linear-gradient(to top, rgb(10,10,10) 0%, rgb(64,64,64) 100%)",
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      idx === d.revenueByMonth.length - 1
                        ? "text-neutral-900"
                        : "text-neutral-500",
                    )}
                  >
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-[11px] text-neutral-500">
            <span>
              {d.totalYearRevenue > 0 ? (
                <>
                  Highest: ৳{d.maxRevenue.toLocaleString()} ({highestMonth?.month})
                </>
              ) : (
                "No revenue recorded this year"
              )}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">
                {d.orderCountYear} orders
              </span>{" "}
              this year
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <div className="space-y-5">
            {d.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-neutral-400">No categories yet</p>
            ) : (
              d.categoryBreakdown.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm font-mono text-neutral-500">
                      ৳{cat.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-neutral-500">
                      {cat.count} products
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {cat.percentage}% of revenue
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mt-4"
          >
            View all products <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding={false}>
          <div className="flex items-center justify-between p-6 border-b border-border">
            <CardTitle>Recent Orders</CardTitle>
            <Link
              href="/admin/orders"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {d.recentOrders.length === 0 ? (
              <div className="p-6 text-sm text-neutral-400">No orders yet</div>
            ) : (
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
                  {d.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-border text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <td className="p-4 font-mono text-xs">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4 font-medium">
                        {order.name ?? order.user?.name ?? order.phone}
                      </td>
                      <td className="p-4 text-neutral-500 hidden sm:table-cell">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className="p-4 font-mono">
                        ৳{toNumber(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <Badge variant={statusBadge[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </td>
                      <td className="p-4 text-neutral-500 text-xs hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {d.topProducts.length === 0 ? (
              <p className="text-sm text-neutral-400">No sales yet</p>
            ) : (
              d.topProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0",
                        i === 0
                          ? "bg-neutral-900 text-white "
                          : "bg-neutral-100 text-neutral-500",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-neutral-500 shrink-0 ml-3">
                    ৳{product.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mt-4"
          >
            View all products <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>
    </div>
  );
}