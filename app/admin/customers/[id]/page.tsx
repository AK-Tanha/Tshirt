'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Calendar, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import Image from 'next/image';
import { useCustomer } from '@/hooks/use-customers';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const statusBadge: Record<string, 'warning' | 'info' | 'neutral' | 'success' | 'danger'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  SHIPPED: 'neutral',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomer(id);

  if (isLoading) {
    return (
      <Card className="p-12 text-center">
        <p className="text-neutral-500">Loading customer...</p>
      </Card>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
        <Card className="p-12 text-center">
          <p className="text-neutral-500">Customer not found</p>
        </Card>
      </div>
    );
  }

  const customerOrders = customer.orders ?? [];
  const totalSpent = customerOrders.reduce((s, o) => s + Number(o.totalAmount), 0);
  const avgOrderValue = customerOrders.length > 0
    ? Math.round(totalSpent / customerOrders.length)
    : 0;

  const stats = [
    { label: 'Total Orders', value: customerOrders.length, icon: Package },
    { label: 'Total Spent', value: `৳${totalSpent.toLocaleString()}`, icon: TrendingUp },
    { label: 'Avg. Order Value', value: `৳${avgOrderValue.toLocaleString()}`, icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            {customer.image ? (
              <Image
                src={customer.image}
                alt={customer.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-2xl font-medium text-neutral-600 mb-4">
                {customer.name.charAt(0)}
              </div>
            )}
            <h2 className="font-display text-xl font-bold">{customer.name}</h2>
            <div className="w-full space-y-3 mt-6 text-sm">
              <div className="flex items-center gap-3 text-neutral-500">
                <Phone className="w-4 h-4 shrink-0" />
                <span className="font-mono">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-500">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Joined {new Date(customer.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">{stat.label}</p>
                      <p className="font-display text-lg font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center">No orders found</p>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider">
                      <th className="pb-3 font-medium">Order</th>
                      <th className="pb-3 font-medium">Items</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border text-sm">
                        <td className="py-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 text-neutral-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                        <td className="py-3 font-mono">৳{Number(order.totalAmount).toLocaleString()}</td>
                        <td className="py-3"><Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge></td>
                        <td className="py-3 text-xs text-neutral-500 hidden sm:table-cell">
                          {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
