'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { orders as initialOrders } from '@/lib/admin-data';
import { products } from '@/lib/data';
import type { Order, Invoice, InvoiceItem } from '@/lib/types';
import {
  Search, Filter, ChevronDown, Eye, X, Check, Truck, PackageCheck,
  RotateCcw, Plus, FileText, Download,
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

const statuses = ['all', 'pending_confirmation', 'confirmed', 'shipped', 'delivered', 'returned'] as const;
type StatusFilter = typeof statuses[number];

const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

let invoiceCounter = 0;

function generateInvoiceNo() {
  invoiceCounter++;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(invoiceCounter).padStart(4, '0')}`;
}

function createInvoice(order: Order): Invoice {
  const items: InvoiceItem[] = order.items.map((item) => {
    const product = productMap[item.productId];
    const unitPrice = product?.price ?? 0;
    return { productId: item.productId, productName: product?.name ?? item.productId, quantity: item.quantity, unitPrice, total: unitPrice * item.quantity };
  });
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.round(subtotal * 0.05);
  return {
    invoiceNo: generateInvoiceNo(),
    orderId: order.id,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    items,
    subtotal,
    tax,
    grandTotal: subtotal + tax,
    status: 'unpaid',
    issuedAt: new Date().toISOString(),
  };
}

const TAX_RATE = 0.05;

export default function AdminOrders() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Record<string, Invoice>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

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

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    if (newStatus === 'confirmed' && !invoices[orderId]) {
      const order = orderList.find((o) => o.id === orderId);
      if (order) {
        const invoice = createInvoice(order);
        setInvoices((prev) => ({ ...prev, [orderId]: invoice }));
      }
    }
    setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <Link
          href="/admin/orders/create"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Order</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-muted hover:text-black transition-colors"
          >
            <Filter className="w-4 h-4" />
            {statusFilter === 'all' ? 'All Status' : statusLabels[statusFilter]}
            <ChevronDown className={cn("w-3 h-3 transition-transform", statusOpen && "rotate-180")} />
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-20 py-1">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-stone transition-colors",
                      statusFilter === s ? "text-black font-medium" : "text-muted",
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

      <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wider bg-stone/50">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Invoice</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const hasInvoice = !!invoices[order.id];
                return (
                  <tr key={order.id} className="border-t border-border text-sm hover:bg-stone/30 transition-colors">
                    <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4 text-muted">{order.phone}</td>
                    <td className="p-4 text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="p-4 font-mono">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColors[order.status])}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      {hasInvoice ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setViewInvoice(invoices[order.id]); }}
                          className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4">
                      <button onClick={() => setSelectedOrder(order)} className="text-muted hover:text-black transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted text-sm">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((order) => {
          const hasInvoice = !!invoices[order.id];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-border p-4 space-y-3" onClick={() => setSelectedOrder(order)}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">#{order.id.slice(0, 8)}</span>
                <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", statusColors[order.status])}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted">{order.phone}</p>
                </div>
                <span className="text-sm font-mono">৳{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <div className="flex items-center gap-2">
                  {hasInvoice && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewInvoice(invoices[order.id]); }}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" /> Invoice
                    </button>
                  )}
                  <span>{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">No orders found</div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            invoice={invoices[selectedOrder.id]}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus)}
            onViewInvoice={() => { setViewInvoice(invoices[selectedOrder.id]); }}
          />
        )}

        {viewInvoice && (
          <InvoiceModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderDetailModal({ order, invoice, onClose, onStatusChange, onViewInvoice }: {
  order: Order; invoice?: Invoice; onClose: () => void; onStatusChange: (s: Order['status']) => void; onViewInvoice: () => void;
}) {
  const statusFlow = ['pending_confirmation', 'confirmed', 'shipped', 'delivered'] as const;
  const currentIdx = statusFlow.indexOf(order.status as typeof statusFlow[number]);
  const nextStatus = currentIdx >= 0 && currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs text-muted uppercase tracking-wider font-medium mb-2">Customer</h3>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-muted">{order.phone}</p>
            <p className="text-sm text-muted">{order.address}</p>
          </div>

          <div>
            <h3 className="text-xs text-muted uppercase tracking-wider font-medium mb-2">Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[order.status])}>
                {statusLabels[order.status]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium",
                    i <= currentIdx ? "bg-black text-white" : "bg-stone text-muted",
                  )}>
                    {i < currentIdx ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div className={cn("flex-1 h-[2px]", i < currentIdx ? "bg-black" : "bg-border")} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {statusFlow.map((s) => (
                <span key={s} className="text-[9px] text-muted">{statusLabels[s]}</span>
              ))}
            </div>

            {nextStatus && (
              <button
                onClick={() => onStatusChange(nextStatus)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
              >
                {nextStatus === 'confirmed' && <Check className="w-4 h-4" />}
                {nextStatus === 'shipped' && <Truck className="w-4 h-4" />}
                {nextStatus === 'delivered' && <PackageCheck className="w-4 h-4" />}
                Mark as {statusLabels[nextStatus]}
              </button>
            )}

            {order.status === 'delivered' && (
              <button
                onClick={() => onStatusChange('returned')}
                className="mt-4 flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Process Return
              </button>
            )}
          </div>

          <div>
            <h3 className="text-xs text-muted uppercase tracking-wider font-medium mb-2">Order Items</h3>
            <div className="bg-stone rounded-lg p-4 space-y-2">
              {order.items.map((item) => {
                const product = productMap[item.productId];
                return (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{product?.name ?? item.productId}</span>
                      <span className="text-muted ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-mono text-xs text-muted">৳{((product?.price ?? 0) * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted">Total Amount</span>
            <span className="font-display text-xl font-bold">৳{order.totalAmount.toLocaleString()}</span>
          </div>

          {invoice && (
            <button
              onClick={onViewInvoice}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Invoice ({invoice.invoiceNo})
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const handlePrint = () => window.print();

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
        className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto print:border-0 print:rounded-none print:max-h-none print:shadow-none"
      >
        <div className="flex items-center justify-between p-6 border-b border-border print:hidden">
          <h2 className="font-display text-lg font-bold">Invoice</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
            >
              <Download className="w-4 h-4" />
              Print / PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-stone rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">APAN</h1>
              <p className="text-xs text-muted mt-1">Premium Apparel</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold">{invoice.invoiceNo}</p>
              <p className="text-xs text-muted">{new Date(invoice.issuedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">Bill To</p>
              <p className="font-medium">{invoice.customerName}</p>
              <p className="text-muted">{invoice.phone}</p>
              <p className="text-muted">{invoice.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">Order</p>
              <p className="font-mono text-xs">#{invoice.orderId.slice(0, 8)}</p>
              <span className={cn(
                "inline-block mt-1 text-[11px] font-medium px-2.5 py-1 rounded-full",
                invoice.status === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
              )}>
                {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wider border-b border-border">
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
                  <td className="py-3 text-right text-muted">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">৳{item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono">৳{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1.5 text-sm ml-auto w-60">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono">৳{invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax (5%)</span>
              <span className="font-mono">৳{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-display text-lg font-bold">
              <span>Total</span>
              <span>৳{invoice.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted pt-6 border-t border-border">
            <p>Thank you for your business!</p>
            <p className="mt-0.5">Apan Apparel &middot; Dhaka, Bangladesh</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


