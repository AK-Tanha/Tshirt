"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useOrder, useUpdateOrderStatus } from "@/hooks/use-orders";
import type { Order, Invoice, InvoiceItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Check,
  Truck,
  PackageCheck,
  RotateCcw,
  FileText,
  Download,
  X,
  Phone,
  MapPin,
  Clock,
  User,
  CreditCard,
  Package,
} from "lucide-react";

const statusBadge: Record<string, "warning" | "info" | "neutral" | "success" | "danger"> = {
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

const statusFlow = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

function createInvoice(order: Order): Invoice {
  const items: InvoiceItem[] = order.items.map((item) => {
    const unitPrice = Number(item.variant.price ?? item.product.basePrice);
    return {
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice,
      total: unitPrice * item.quantity,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = Math.round(subtotal * 0.05);
  return {
    invoiceNo: `INV-${new Date().getFullYear()}-${order.id.slice(0, 4).toUpperCase()}`,
    orderId: order.id,
    customerName: order.name ?? order.user?.name ?? order.phone,
    phone: order.phone,
    address: order.address,
    items,
    subtotal,
    tax,
    grandTotal: subtotal + tax,
    status: order.status === "DELIVERED" ? "paid" : "unpaid",
    issuedAt: new Date().toISOString(),
  };
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: order, isLoading } = useOrder(params.id);
  const updateStatus = useUpdateOrderStatus();
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">Order not found</p>
      </div>
    );
  }

  const invoice = createInvoice(order);
  const currentIdx = statusFlow.indexOf(order.status as (typeof statusFlow)[number]);
  const nextStatus =
    currentIdx >= 0 && currentIdx < statusFlow.length - 1
      ? statusFlow[currentIdx + 1]
      : null;

  const updateStatusHandler = (newStatus: Order["status"]) => {
    updateStatus.mutate(
      { id: order.id, status: newStatus },
      {
        onSuccess: () => {
          toast(`Order ${order.id.slice(0, 8)} marked as ${statusLabels[newStatus]}`, "success");
        },
        onError: (err) => toast(err.message, "error"),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Order #{order.id.slice(0, 8)}
            </h1>
            <Badge variant={statusBadge[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <CardTitle className="mb-4">Order Timeline</CardTitle>
            <div className="flex items-center gap-1 mb-6">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center gap-1 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                      i <= currentIdx
                        ? "bg-neutral-900 text-white "
                        : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {i < currentIdx ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-[3px] rounded-full",
                        i < currentIdx ? "bg-neutral-900 " : "bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mb-6">
              {statusFlow.map((s) => (
                <span
                  key={s}
                  className="text-[11px] text-neutral-500 font-medium"
                >
                  {statusLabels[s]}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {nextStatus && order.status !== "CANCELLED" && (
                <button
                  onClick={() => updateStatusHandler(nextStatus)}
                  disabled={updateStatus.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {nextStatus === "CONFIRMED" && <Check className="w-4 h-4" />}
                  {nextStatus === "SHIPPED" && <Truck className="w-4 h-4" />}
                  {nextStatus === "DELIVERED" && (
                    <PackageCheck className="w-4 h-4" />
                  )}
                  Mark as {statusLabels[nextStatus]}
                </button>
              )}
              {order.status !== "CANCELLED" && (
                <button
                  onClick={() => updateStatusHandler("CANCELLED")}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-4">Order Items</CardTitle>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.variant.size} / {item.variant.color} &middot; Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm">
                    ৳{(Number(item.variant.price ?? item.product.basePrice) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
              <span className="text-sm text-neutral-500">Total Amount</span>
              <span className="font-display text-2xl font-bold">
                ৳{Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-neutral-500" />
              </div>
              <CardTitle>Customer</CardTitle>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                  Name
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {order.name ?? order.user?.name ?? order.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                  Phone
                </p>
                <p className="text-sm mt-0.5">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                  Address
                </p>
                <p className="text-sm mt-0.5">{order.address}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 text-neutral-500" />
              </div>
              <CardTitle>Payment</CardTitle>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                  Method
                </p>
                <p className="text-sm mt-0.5 capitalize">Cash on Delivery</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                  Status
                </p>
                <div className="mt-0.5">
                  <Badge variant={invoice.status === "paid" ? "success" : "warning"}>
                    {invoice.status === "paid" ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                <FileText className="w-4.5 h-4.5 text-neutral-500" />
              </div>
              <CardTitle>Invoice</CardTitle>
            </div>
            <p className="text-sm font-mono text-neutral-500 mb-3">
              {invoice.invoiceNo}
            </p>
            <button
              onClick={() => setViewInvoice(invoice)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Invoice
            </button>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-3">Order Activity</CardTitle>
            <div className="space-y-4">
              {[
                { action: "Order created", time: order.createdAt, icon: Clock },
                ...(order.status !== "PENDING"
                  ? [
                      {
                        action: `Status changed to ${statusLabels[order.status]}`,
                        time: order.createdAt,
                        icon: Check,
                      },
                    ]
                  : []),
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <event.icon className="w-3 h-3 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm">{event.action}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(event.time).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {viewInvoice && (
          <InvoiceModal
            invoice={viewInvoice}
            onClose={() => setViewInvoice(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InvoiceModal({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
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
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Download className="w-4 h-4" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                APAN
              </h1>
              <p className="text-xs text-neutral-500 mt-1">Premium Apparel</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold">
                {invoice.invoiceNo}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(invoice.issuedAt).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                Bill To
              </p>
              <p className="font-medium">{invoice.customerName}</p>
              <p className="text-neutral-500">{invoice.phone}</p>
              <p className="text-neutral-500">{invoice.address}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                Order
              </p>
              <p className="font-mono text-xs">
                #{invoice.orderId.slice(0, 8)}
              </p>
              <Badge
                variant={invoice.status === "paid" ? "success" : "warning"}
                className="mt-1"
              >
                {invoice.status === "paid" ? "Paid" : "Unpaid"}
              </Badge>
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
                  <td className="py-3 text-right text-neutral-500">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-mono">
                    ৳{item.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono">
                    ৳{item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-y-1.5 text-sm ml-auto w-60">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-mono">
                ৳{invoice.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tax (5%)</span>
              <span className="font-mono">৳{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-display text-lg font-bold">
              <span>Total</span>
              <span>৳{invoice.grandTotal.toLocaleString()}</span>
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
