'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/hooks/use-customers';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Field, getInputClass } from '@/components/ui/Field';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Eye, Pencil, Trash2, Plus, X, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Customer } from '@/lib/types';
import Image from 'next/image';

const PAGE_SIZE = 8;

interface CustomerFormState {
  id: string | null;
  name: string;
  phone: string;
  password: string;
  address: string;
}

const emptyForm: CustomerFormState = {
  id: null,
  name: '',
  phone: '',
  password: '',
  address: '',
};

export default function AdminCustomers() {
  const { data: customers = [], isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setFormOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setForm({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      password: '',
      address: customer.address ?? '',
    });
    setFormOpen(true);
  };

  const passwordValid =
    form.password.length === 0 || form.password.length >= 6;
  const validForm =
    form.name.trim() &&
    form.phone.trim() &&
    (!form.id ? form.password.length >= 6 : true) &&
    passwordValid;

  const handleSubmit = () => {
    if (!validForm) return;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      ...(form.address.trim() && { address: form.address.trim() }),
    };

    if (form.id) {
      updateCustomer.mutate(
        {
          id: form.id,
          payload: {
            ...payload,
            ...(form.password && { password: form.password }),
          },
        },
        {
          onSuccess: () => {
            toast('Customer updated');
            setFormOpen(false);
          },
          onError: (err) => toast(err.message, 'error'),
        },
      );
    } else {
      createCustomer.mutate(
        { ...payload, password: form.password },
        {
          onSuccess: () => {
            toast('Customer created');
            setFormOpen(false);
          },
          onError: (err) => toast(err.message, 'error'),
        },
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCustomer.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast(`Deleted "${deleteTarget.name}"`);
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast(err.message, 'error');
        setDeleteTarget(null);
      },
    });
  };

  const busy =
    createCustomer.isPending ||
    updateCustomer.isPending ||
    deleteCustomer.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-neutral-500 mt-1">{customers.length} total customers</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </button>
      </div>

      <Card>
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
      </Card>

      <div className="bg-white rounded-xl border border-border overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium hidden sm:table-cell">Phone</th>
                <th className="p-4 font-medium hidden md:table-cell">Orders</th>
                <th className="p-4 font-medium hidden lg:table-cell">Joined</th>
                <th className="p-4 font-medium w-32"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-neutral-500">Loading customers...</td>
                </tr>
              )}
              {paged.map((customer) => (
                <tr key={customer.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <Image
                          src={customer.image}
                          alt={customer.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:text-neutral-600 transition-colors">
                          {customer.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-500 hidden sm:table-cell">
                    <span className="font-mono text-xs">{customer.phone}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant={customer._count?.orders ? 'info' : 'neutral'}>
                      {customer._count?.orders ?? 0} order{customer._count?.orders === 1 ? '' : 's'}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs text-neutral-500 hidden lg:table-cell">
                    {new Date(customer.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(customer)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        aria-label={`Edit ${customer.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        aria-label={`View ${customer.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(customer)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${customer.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && paged.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-neutral-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {isLoading && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            Loading customers...
          </div>
        )}
        {paged.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{customer.name}</p>
                  <p className="text-xs text-neutral-500 font-mono">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(customer)}
                  aria-label="Edit customer"
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <Link
                  href={`/admin/customers/${customer.id}`}
                  aria-label="View customer"
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(customer)}
                  aria-label="Delete customer"
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-3 text-sm text-neutral-500">
              <span>{customer._count?.orders ?? 0} order{customer._count?.orders === 1 ? '' : 's'}</span>
              <span className="text-xs">
                {new Date(customer.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
        {!isLoading && paged.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-neutral-500">
            No customers found
          </div>
        )}
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

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
            onClick={() => !busy && setFormOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl border border-border w-full max-w-md p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {form.id ? 'Edit Customer' : 'New Customer'}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {form.id
                      ? 'Update the customer details.'
                      : 'Create an account for a customer.'}
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  disabled={busy}
                  className="p-1.5 hover:bg-stone rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahim Uddin"
                    autoFocus
                    disabled={busy}
                    className={getInputClass(undefined, 'disabled:opacity-50')}
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01712345678"
                    disabled={busy}
                    className={getInputClass(undefined, 'disabled:opacity-50')}
                  />
                </Field>
                <Field
                  label={form.id ? 'Password' : 'Password'}
                  required={!form.id}
                  error={!passwordValid ? 'Password must be at least 6 characters' : undefined}
                >
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={form.id ? 'Leave blank to keep current' : 'At least 6 characters'}
                    disabled={busy}
                    className={getInputClass(undefined, 'disabled:opacity-50')}
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                    rows={2}
                    disabled={busy}
                    className={cn(getInputClass(undefined, 'disabled:opacity-50'), 'resize-none')}
                  />
                </Field>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFormOpen(false)}
                  disabled={busy}
                  className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!validForm || busy}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.id ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete customer?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed. Customers with order history cannot be deleted.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}