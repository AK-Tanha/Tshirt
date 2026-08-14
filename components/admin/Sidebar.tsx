'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/navigation';
import { useSite } from '@/hooks/use-site';
import { ChevronDown, LogOut, PanelLeftClose, PanelLeft, Store } from 'lucide-react';

export default function Sidebar({ collapsed, onToggle, onNavigate }: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
 const pathname = usePathname();
 const [expanded, setExpanded] = useState<string | null>('Orders');
 const { data: site } = useSite();

 const toggleSection = (label: string) => {
 setExpanded((prev) => (prev === label ? null : label));
 };

 const matchActive = (href: string) =>
 pathname === href || pathname.startsWith(href + '/');

 return (
 <aside
 className={cn(
 'fixed top-0 left-0 h-full z-30 flex flex-col bg-white border-r border-border transition-all duration-300',
 collapsed ? 'w-16' : 'w-64',
 )}
 >
  <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed && 'justify-center')}>
   <Link href="/admin" onClick={onNavigate} className={cn('flex items-center gap-2.5 min-w-0', collapsed && 'hidden')}>
  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
  <Store className="w-4 h-4 text-white " />
  </div>
  <span className="font-display text-base font-bold tracking-tight truncate">{(site?.siteName ?? "APAN").toUpperCase()}</span>
  </Link>
  <button
  onClick={onToggle}
  className={cn(
  'p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors',
  collapsed ? 'mx-auto' : 'ml-auto',
  )}
  title={collapsed ? 'Expand' : 'Collapse'}
  >
  {collapsed ? <PanelLeft className="w-4.5 h-4.5" /> : <PanelLeftClose className="w-4.5 h-4.5" />}
  </button>
  </div>

 <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-0.5">
 {navItems.map((item) => {
 const hasChildren = item.children && item.children.length > 0;

 const matchedChild = hasChildren
 ? item.children!.reduce<{ href: string; label: string } | null>((best, c) => {
 const matches = matchActive(c.href);
 return matches && (!best || c.href.length > best.href.length) ? c : best;
 }, null)
 : null;

 const active = item.href
 ? (item.href === '/admin' ? pathname === item.href : matchActive(item.href))
 : !!matchedChild;

 const open = expanded === item.label;

 return (
 <div key={item.label}>
 {hasChildren ? (
 <button
 onClick={() => toggleSection(item.label)}
 className={cn(
 'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
 active
 ? 'bg-neutral-900 text-white '
 : 'text-neutral-600 hover:bg-neutral-100 ',
 collapsed && 'justify-center px-2',
 )}
 title={collapsed ? item.label : undefined}
 >
 <item.icon className="w-4.5 h-4.5 shrink-0" />
 {!collapsed && (
 <>
 <span className="flex-1 text-left truncate">{item.label}</span>
 <motion.div
 animate={{ rotate: open ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 >
 <ChevronDown className="w-3.5 h-3.5 opacity-50" />
 </motion.div>
 </>
 )}
 </button>
 ) : (
  <Link
  href={item.href!}
  onClick={onNavigate}
  className={cn(
 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
 active
 ? 'bg-neutral-900 text-white '
 : 'text-neutral-600 hover:bg-neutral-100 ',
 collapsed && 'justify-center px-2',
 )}
 title={collapsed ? item.label : undefined}
 >
 <item.icon className="w-4.5 h-4.5 shrink-0" />
 {!collapsed && <span className="truncate">{item.label}</span>}
 </Link>
 )}

 {hasChildren && !collapsed && (
 <AnimatePresence initial={false}>
 {open && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <div className="ml-1 pl-4 border-l border-border space-y-0.5 mt-0.5">
 {item.children!.map((child) => (
  <Link
  key={child.href}
  href={child.href}
  onClick={onNavigate}
  className={cn(
 'block px-3 py-1.5 rounded-lg text-sm transition-colors',
 child === matchedChild
 ? 'text-neutral-900 font-medium bg-neutral-100 '
 : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 ',
 )}
 >
 {child.label}
 </Link>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 )}
 </div>
 );
 })}
 </nav>

  <div className="p-2 border-t border-border">
   <Link
  href="/"
  onClick={onNavigate}
  className={cn(
 'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 transition-colors',
 collapsed && 'justify-center',
 )}
 >
 <LogOut className="w-4.5 h-4.5 shrink-0" />
 {!collapsed && <span>Back to Store</span>}
 </Link>
 </div>
 </aside>
 );
}
