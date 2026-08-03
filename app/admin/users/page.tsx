'use client';

import { useState } from 'react';
import { useUsers, useUpdateUserRole } from '@/hooks/use-users';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Search,
  Users as UsersIcon,
  ShieldCheck,
  ShieldOff,
  ShoppingBag,
  Phone,
  Loader2,
} from 'lucide-react';
import type { UserRecord } from '@/lib/types';

type RoleFilter = 'all' | 'USER' | 'ADMIN';

export default function AdminUsers() {
  const { data: users = [], isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const q = search.toLowerCase();
  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      (u.address ?? '').toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const handleRoleToggle = (user: UserRecord) => {
    const next: 'USER' | 'ADMIN' = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    updateRole.mutate(
      { id: user.id, role: next },
      {
        onSuccess: () => toast(`${user.name} is now ${next === 'ADMIN' ? 'an admin' : 'a customer'}`),
        onError: (err) => toast(err.message, 'error'),
      },
    );
  };

  const pending = updateRole.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-neutral-500 mt-1">{users.length} registered users</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={users.length} icon={UsersIcon} color="bg-black text-white" />
        <StatCard
          title="Admins"
          value={users.filter((u) => u.role === 'ADMIN').length}
          icon={ShieldCheck}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Customers"
          value={users.filter((u) => u.role === 'USER').length}
          icon={ShieldOff}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, phone or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-neutral-100 rounded-lg w-fit">
            {(['all', 'USER', 'ADMIN'] as RoleFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  roleFilter === r
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900',
                )}
              >
                {r === 'all' ? 'All' : r === 'USER' ? 'Customers' : 'Admins'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium hidden md:table-cell">Contact</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium hidden lg:table-cell">Joined</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-neutral-500">Loading users...</td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-border text-sm hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center font-medium text-xs text-neutral-600 shrink-0 uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-neutral-500 font-mono truncate">{user.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-neutral-500">
                      <Phone className="w-3.5 h-3.5" /> {user.phone}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-neutral-600">
                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                      {user._count?.orders ?? 0}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 text-xs hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'text-[11px] font-medium px-2.5 py-1 rounded-full',
                        user.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-100 text-neutral-600',
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRoleToggle(user)}
                      disabled={pending}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
                      title={user.role === 'ADMIN' ? 'Remove admin' : 'Make admin'}
                    >
                      {pending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : user.role === 'ADMIN' ? (
                        <ShieldOff className="w-3 h-3" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      <span className="hidden sm:inline">
                        {user.role === 'ADMIN' ? 'Remove admin' : 'Make admin'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-neutral-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        Roles control access to the admin panel. Only admins can reach /admin/*.
      </p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string; value: number; icon: React.ElementType; color: string;
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
    </motion.div>
  );
}