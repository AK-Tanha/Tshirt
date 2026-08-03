import type { Order, Product, UserRecord } from "@/lib/types";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DashboardData {
  revenueToday: number;
  revenueYesterday: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  ordersToday: number;
  ordersYesterday: number;
  pendingOrders: number;
  completedOrders: number;
  newCustomersThisMonth: number;
  newCustomersLastMonth: number;
  totalProducts: number;
  lowStockItems: number;
  revenueByMonth: MonthlyRevenue[];
  totalYearRevenue: number;
  orderCountYear: number;
  maxRevenue: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  categoryBreakdown: { category: string; count: number; revenue: number; percentage: number }[];
  recentOrders: Order[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function toNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  return Number(value ?? 0);
}

export function pctChange(current: number, previous: number): number | undefined {
  if (!previous || previous <= 0) return undefined;
  const change = ((current - previous) / previous) * 100;
  if (!isFinite(change)) return undefined;
  return Math.round(change * 10) / 10;
}

export function buildDashboard(orders: Order[], products: Product[], users: UserRecord[]): DashboardData {
  const now = new Date();
  const year = now.getFullYear();
  const todayStart = new Date(year, now.getMonth(), now.getDate());
  const yesterdayStart = new Date(year, now.getMonth(), now.getDate() - 1);
  const monthStart = new Date(year, now.getMonth(), 1);
  const lastMonthStart = new Date(year, now.getMonth() - 1, 1);
  const lastMonthEnd = monthStart;

  let revenueToday = 0;
  let revenueYesterday = 0;
  let revenueThisMonth = 0;
  let revenueLastMonth = 0;
  let ordersToday = 0;
  let ordersYesterday = 0;
  let pendingOrders = 0;
  let completedOrders = 0;
  let totalYearRevenue = 0;
  let orderCountYear = 0;

  const monthRevenue = new Array<number>(12).fill(0);
  const productMap = new Map<string, { name: string; sales: number; revenue: number }>();
  const categoryRevenue = new Map<string, number>();

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const amt = toNumber(o.totalAmount);

    if (d >= todayStart) {
      revenueToday += amt;
      ordersToday++;
    }
    if (d >= yesterdayStart && d < todayStart) {
      revenueYesterday += amt;
      ordersYesterday++;
    }
    if (d >= monthStart) revenueThisMonth += amt;
    if (d >= lastMonthStart && d < lastMonthEnd) revenueLastMonth += amt;
    if (d.getFullYear() === year) {
      monthRevenue[d.getMonth()] += amt;
      totalYearRevenue += amt;
      orderCountYear++;
    }

    if (o.status === "PENDING") pendingOrders++;
    if (o.status === "DELIVERED") completedOrders++;

    for (const item of o.items) {
      if (!item.product) continue;
      const lineRevenue = item.quantity * toNumber(item.price);
      const catName = item.product.category?.name ?? "Uncategorized";
      categoryRevenue.set(catName, (categoryRevenue.get(catName) ?? 0) + lineRevenue);

      const cur = productMap.get(item.product.id) ?? { name: item.product.name, sales: 0, revenue: 0 };
      cur.sales += item.quantity;
      cur.revenue += lineRevenue;
      productMap.set(item.product.id, cur);
    }
  }

  let totalProducts = 0;
  let lowStockItems = 0;
  const categoryCount = new Map<string, number>();

  for (const p of products) {
    totalProducts++;
    const catName = p.category?.name ?? "Uncategorized";
    categoryCount.set(catName, (categoryCount.get(catName) ?? 0) + 1);
    for (const v of p.variants) {
      if (v.stock <= 5) lowStockItems++;
    }
  }

  const customers = users.filter((u) => u.role === "USER");
  const newCustomersThisMonth = customers.filter((u) => new Date(u.createdAt) >= monthStart).length;
  const newCustomersLastMonth = customers.filter((u) => {
    const d = new Date(u.createdAt);
    return d >= lastMonthStart && d < lastMonthEnd;
  }).length;

  const revenueByMonth = monthRevenue.map((revenue, i) => ({ month: MONTHS[i], revenue }));
  const maxRevenue = Math.max(...monthRevenue, 1);

  const topProducts = [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const totalCategoryRevenue = [...categoryRevenue.values()].reduce((s, r) => s + r, 0);
  const categoryBreakdown = [...categoryCount.entries()].map(([category, count]) => {
    const revenue = categoryRevenue.get(category) ?? 0;
    const percentage = totalCategoryRevenue > 0 ? Math.round((revenue / totalCategoryRevenue) * 100) : 0;
    return { category, count, revenue, percentage };
  });

  return {
    revenueToday,
    revenueYesterday,
    revenueThisMonth,
    revenueLastMonth,
    ordersToday,
    ordersYesterday,
    pendingOrders,
    completedOrders,
    newCustomersThisMonth,
    newCustomersLastMonth,
    totalProducts,
    lowStockItems,
    revenueByMonth,
    totalYearRevenue,
    orderCountYear,
    maxRevenue,
    topProducts,
    categoryBreakdown,
    recentOrders: orders.slice(0, 5),
  };
}