'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { orders as initialOrders } from '@/lib/admin-data';
import { products } from '@/lib/data';
import type { Order, Invoice, InvoiceItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import {
  Search, Filter, ChevronDown, Eye, X, Check, Truck, PackageCheck,
  RotateCcw, Plus, FileText, Download,
} from 'lucide-react';

const statusBadge: Record<string, 'warning' | 'info' | 'neutral' | 'success' | 'danger'> = {
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

const statuses = ['all', 'pending_confirmation', 'confirmed', 'shipped', 'delivered', 'returned'] as const;
type StatusFilter = typeof statuses[number];

const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

export default function AdminOrders() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('new_orders') || '[]');
    const merged = [...stored, ...initialOrders];
    setOrderList(merged);
    sessionStorage.removeItem('new_orders');
  }, []);

  const filtered = orderList.filter((o) => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (order: Order) => {
    const storedInvoices = JSON.parse(sessionStorage.getItem('order_invoices') || '{}');
    const inv = storedInvoices[order.id];
    if (inv) {
      setViewInvoice(inv);
    } else {
      toast('No invoice generated yet. Confirm the order first.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">{filtered.length} of {orderList.length} orders</p>
        </div>
        <Link
          href="/admin/orders/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Order</span>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all placeholder:text-neutral-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'All Status' : statusLabels[statusFilter]}
              <ChevronDown className={cn('w-3 h-3 transition-transform', statusOpen && 'rotate-180')} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-lg z-20 py-1">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors',
                        statusFilter === s ? 'text-neutral-900 dark:text-white font-medium' : 'text-neutral-500',
                      )}
                    >
                      {s === 'all' ? 'All Status' : statusLabels[s]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium hidden sm:table-cell">Phone</th>
                <th className="p-4 font-medium hidden md:table-cell">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden md:table-cell">Invoice</th>
                <th className="p-4 font-medium hidden lg:table-cell">Date</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const storedInvoices = JSON.parse(sessionStorage.getItem('order_invoices') || '{}');
                const hasInvoice = !!storedInvoices[order.id];
                return (
                  <tr key={order.id} className="border-t border-border text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4 text-neutral-500 hidden sm:table-cell">{order.phone}</td>
                    <td className="p-4 text-neutral-500 hidden md:table-cell">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="p-4 font-mono">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="p-4"><Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge></td>
                    <td className="p-4 hidden md:table-cell">
                      {hasInvoice ? (
                        <button onClick={(e) => { e.stopPropagation(); handleViewInvoice(order); }} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> View
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-neutral-500 text-xs hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-sm text-neutral-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Showing {filtered.length} of {orderList.length} orders</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40">Previous</button>
          <span className="px-2 font-medium">1</span>
          <button className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40">Next</button>
        </div>
      </div>

      <AnimatePresence>
        {viewInvoice && (
          <InvoiceModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:bg-white print:p-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto print:border-0 print:rounded-none print:max-h-none print:shadow-none"
      >
        <div className="flex items-center justify-between p-6 border-b border-border print:hidden">
          <h2 className="font-display text-lg font-bold">Invoice</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Download className="w-4 h-4" /> Print / PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">APAN</h1>
              <p className="text-xs text-neutral-500 mt-1">Premium Apparel</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold">{invoice.invoiceNo}</p>
              <p className="text-xs text-neutral-500">{new Date(invoice.issuedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Bill To</p>
              <p className="font-medium">{invoice.customerName}</p>
              <p className="text-neutral-500">{invoice.phone}</p>
              <p className="text-neutral-500">{invoice.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Order</p>
              <p className="font-mono text-xs">#{invoice.orderId.slice(0, 8)}</p>
              <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>{invoice.status === 'paid' ? 'Paid' : 'Unpaid'}</Badge>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider border-b border-border">
                <th className="pb-3 font-medium">Item</th>
                <th className="pb-3 font-medium text-right">Qty</th>
                <th className="pb-3 font-medium text-right">Unit Price</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.productId} className="border-b border-border/50">
                  <td className="py-3 font-medium">{item.productName}</td>
                  <td className="py-3 text-right text-neutral-500">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">৳{item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono">৳{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-1.5 text-sm ml-auto w-60">
            <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span className="font-mono">৳{invoice.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Tax (5%)</span><span className="font-mono">৳{invoice.tax.toLocaleString()}</span></div>
            <div className="flex justify-between pt-2 border-t border-border font-display text-lg font-bold">
              <span>Total</span><span>৳{invoice.grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-center text-xs text-neutral-500 pt-6 border-t border-border">
            <p>Thank you for your business!</p>
            <p className="mt-0.5">Apan Apparel &middot; Dhaka, Bangladesh</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
