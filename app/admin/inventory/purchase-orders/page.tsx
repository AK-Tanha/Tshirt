'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePurchaseOrders, useUpdatePurchaseOrderStatus } from '@/hooks/use-purchase-orders';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { PurchaseOrder, PurchaseOrderStatus } from '@/lib/types';
import {
  Package, Plus, X, Calendar, StickyNote, Phone, MapPin,
  CheckCircle, Loader2, ArrowRight, Boxes,
} from 'lucide-react';

const statusMeta: Record<PurchaseOrderStatus, { label: string; badge: string; dot: string }> = {
  PENDING: { label: 'Pending', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  ORDERED: { label: 'Ordered', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  RECEIVED: { label: 'Received', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const nextStatus: Partial<Record<PurchaseOrderStatus, PurchaseOrderStatus>> = {
  PENDING: 'ORDERED',
  ORDERED: 'RECEIVED',
};

export default function AdminPurchaseOrders() {
  const { data: orders = [], isLoading } = usePurchaseOrders();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const { toast } = useToast();
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<PurchaseOrder | null>(null);

  const totalCost = orders.reduce((s, o) => s + Number(o.totalCost), 0);
  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const received = orders.filter((o) => o.status === 'RECEIVED').length;

  const handleAdvance = (po: PurchaseOrder) => {
    const next = nextStatus[po.status];
    if (!next) return;
    updateStatus.mutate(
      { id: po.id, status: next },
      {
        onSuccess: () =>
          toast(
            next === 'RECEIVED'
              ? `PO #${po.id.slice(0, 8)} received — stock updated`
              : `PO #${po.id.slice(0, 8)} marked ordered`,
          ),
        onError: (err) => toast(err.message, 'error'),
      },
    );
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    updateStatus.mutate(
      { id: cancelTarget.id, status: 'CANCELLED' },
      {
        onSuccess: () => {
          toast(`PO #${cancelTarget.id.slice(0, 8)} cancelled`);
          setCancelTarget(null);
        },
        onError: (err) => {
          toast(err.message, 'error');
          setCancelTarget(null);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">{orders.length} total purchase orders</p>
        </div>
        <Link
          href="/admin/inventory/purchase-orders/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New PO</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total POs" value={orders.length} subtitle={`৳${totalCost.toLocaleString()} total value`} icon={Package} color="bg-black text-white" />
        <StatCard title="Pending" value={pending} subtitle="awaiting supplier" icon={Boxes} color="bg-amber-100 text-amber-700" />
        <StatCard title="Received" value={received} subtitle="stock added" icon={CheckCircle} color="bg-emerald-100 text-emerald-700" />
        <StatCard title="In Transit" value={orders.filter((o) => o.status === 'ORDERED').length} subtitle="ordered from supplier" icon={ArrowRight} color="bg-blue-100 text-blue-600" />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="p-4 font-medium">PO #</th>
                <th className="p-4 font-medium">Supplier</th>
                <th className="p-4 font-medium hidden sm:table-cell">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium hidden lg:table-cell">Created</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-neutral-500">Loading purchase orders...</td>
                </tr>
              )}
              {orders.map((po) => {
                const meta = statusMeta[po.status];
                const canAdvance = !!nextStatus[po.status];
                return (
                  <tr key={po.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-mono text-xs">#{po.id.slice(0, 8)}</td>
                    <td className="p-4 font-medium">{po.supplier.name}</td>
                    <td className="p-4 text-neutral-500 hidden sm:table-cell">{po.items.length}</td>
                    <td className="p-4 font-mono">৳{Number(po.totalCost).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full', meta.badge)}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-xs hidden lg:table-cell">
                      {new Date(po.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {canAdvance && (
                          <button
                            onClick={() => handleAdvance(po)}
                            disabled={updateStatus.isPending}
                            className="px-3 py-1.5 bg-neutral-900 text-white text-[11px] font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                          >
                            {po.status === 'ORDERED' ? 'Receive' : 'Mark Ordered'}
                          </button>
                        )}
                        {po.status === 'PENDING' && (
                          <button
                            onClick={() => setCancelTarget(po)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Cancel PO"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(po)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label="View PO"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-neutral-500">
                    No purchase orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && <Podrawer po={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel purchase order?"
        message={cancelTarget ? `PO #${cancelTarget.id.slice(0, 8)} to ${cancelTarget.supplier.name} will be cancelled.` : ''}
        confirmLabel="Cancel PO"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}

function Podrawer({ po, onClose }: { po: PurchaseOrder; onClose: () => void }) {
  const meta = statusMeta[po.status];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white border-l border-border shadow-xl overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold">PO #{po.id.slice(0, 8)}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{po.supplier.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full', meta.badge)}>{meta.label}</span>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Calendar className="w-4 h-4 text-neutral-400" />
            Created {new Date(po.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
            {po.receivedAt && (
              <span className="text-emerald-600">· Received {new Date(po.receivedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Phone</p>
              <p className="text-sm font-medium">{po.supplier.phone}</p>
            </div>
            {po.supplier.email && (
              <div className="ml-2">
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm font-medium">{po.supplier.email}</p>
              </div>
            )}
          </div>

          {po.notes && (
            <div className="flex items-start gap-3">
              <StickyNote className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-neutral-500">Notes</p>
                <p className="text-sm text-neutral-700">{po.notes}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-3">
              Items ({po.items.length})
            </h3>
            <div className="space-y-2">
              {po.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-neutral-100 rounded-lg text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.variant.product?.name ?? 'Product'}</p>
                    <p className="text-xs text-neutral-500">
                      {item.variant.size} / {item.variant.color} · ×{item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-xs shrink-0 ml-3">
                    ৳{(Number(item.unitCost) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white rounded-lg">
            <span className="text-sm font-medium">Total</span>
            <span className="font-display text-lg font-bold">৳{Number(po.totalCost).toLocaleString()}</span>
          </div>

          {po.status === 'RECEIVED' && (
            <p className="text-xs text-emerald-600 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Stock for these items was added on receipt.
            </p>
          )}
          {po.supplier.address && (
            <p className="text-xs text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {po.supplier.address}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: number | string; subtitle: string; icon: React.ElementType; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border p-4 md:p-5"
    >
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', color)}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
      <p className="text-[10px] text-neutral-500/60 mt-0.5">{subtitle}</p>
    </motion.div>
  );
}