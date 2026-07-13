'use client';

import { useState } from 'react';
import Link from 'next/link';
import { customers as initialCustomers, type Customer } from '@/lib/admin-data';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Search, Eye, Trash2, ChevronDown, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(0);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const { toast } = useToast();

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const handleDelete = () => {
    if (!deleting) return;
    setCustomers((prev) => prev.filter((c) => c.id !== deleting.id));
    toast(`"${deleting.name}" removed from customers`, 'error');
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-neutral-500 mt-1">{customers.length} total customers</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'All Status' : statusFilter === 'active' ? 'Active' : 'Inactive'}
              <ChevronDown className={cn('w-3 h-3 transition-transform', statusOpen && 'rotate-180')} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-border rounded-xl shadow-lg z-20 py-1">
                  {(['all', 'active', 'inactive'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(0); }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition-colors',
                        statusFilter === s ? 'text-neutral-900 font-medium' : 'text-neutral-500',
                      )}
                    >
                      {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium hidden sm:table-cell">Contact</th>
                <th className="p-4 font-medium hidden md:table-cell">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium hidden lg:table-cell">Last Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((customer) => (
                <tr key={customer.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-neutral-600 transition-colors">
                          {customer.name}
                        </Link>
                        <p className="text-xs text-neutral-500 truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-500 hidden sm:table-cell">
                    <span className="font-mono text-xs">{customer.phone}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">{customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}</td>
                  <td className="p-4 font-mono font-medium">৳{customer.totalSpent.toLocaleString()}</td>
                  <td className="p-4 text-xs text-neutral-500 hidden lg:table-cell">
                    {new Date(customer.lastOrderDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <Badge variant={customer.status === 'active' ? 'success' : 'neutral'}>
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleting(customer)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-neutral-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>Showing {filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} customers</span>
        <div className="flex items-center gap-2">
          <button
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 font-medium">{safePage + 1}</span>
          <button
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(safePage + 1)}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleting}
        title="Remove Customer"
        message={`Are you sure you want to remove "${deleting?.name}" from your customer list?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
