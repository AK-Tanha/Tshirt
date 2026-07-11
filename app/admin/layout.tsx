'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingCart, Shirt,
  Settings, Menu, X, LogOut, Package, Building2,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Shirt },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/vendors', label: 'Vendors', icon: Building2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-stone">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-stone rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin" className="font-display text-lg font-bold tracking-tight">APAN Admin</Link>
        <div className="w-9" />
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-50 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="h-14 flex items-center justify-between px-6 border-b border-border">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight">APAN Admin</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 -mr-2 hover:bg-stone rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-black text-white" : "text-muted hover:text-black hover:bg-stone",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-black hover:bg-stone transition-colors">
            <LogOut className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
