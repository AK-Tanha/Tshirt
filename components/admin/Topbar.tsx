'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  Search, Bell, Menu, ChevronDown, User,
 Settings, LogOut, HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function getPageTitle(pathname: string): string {
 for (const item of navItems) {
 if (item.href === pathname) return item.label;
 if (item.children) {
 const child = item.children.find((c) => c.href === pathname || pathname.startsWith(c.href + '/'));
 if (child) return child.label;
 }
 }
 return 'Dashboard';
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [searchOpen, setSearchOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [profileOpen, setProfileOpen] = useState(false);
 const searchRef = useRef<HTMLInputElement>(null);
 const profileRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (searchOpen && searchRef.current) searchRef.current.focus();
 }, [searchOpen]);

 useEffect(() => {
 const handleClick = (e: MouseEvent) => {
 if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
 setProfileOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClick);
 return () => document.removeEventListener('mousedown', handleClick);
 }, []);

 const pageTitle = getPageTitle(pathname);

 const allNavLinks = navItems.flatMap((item) =>
 item.children ? item.children.map((c) => c) : [],
 );
 const searchResults = searchQuery.trim()
 ? allNavLinks.filter((l) =>
 l.label.toLowerCase().includes(searchQuery.toLowerCase()),
 )
 : [];

 return (
 <header className="h-16 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-20">
 <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-3">
 <div className="flex items-center gap-3">
 <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors">
 <Menu className="w-5 h-5" />
 </button>
 <div>
 <h1 className="font-display text-lg font-bold tracking-tight">{pageTitle}</h1>
 </div>
 </div>

 <div className="flex items-center gap-1.5">
 <div className="relative hidden sm:block">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
 <input
 type="text"
 placeholder="Search..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setSearchOpen(true)}
 className="w-56 lg:w-72 pl-9 pr-4 py-2 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all placeholder:text-neutral-400"
 />
 <AnimatePresence>
 {searchOpen && searchResults.length > 0 && (
 <motion.div
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 4 }}
 className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
 >
{searchResults.slice(0, 8).map((r) => (
  <Link
  key={r.href}
  href={r.href}
  className="block px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
  >
  {r.label}
  </Link>
  ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>

  <button className="relative p-2.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors">
 <Bell className="w-4.5 h-4.5" />
 <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white " />
 </button>

 <div className="relative" ref={profileRef}>
 <button
 onClick={() => setProfileOpen(!profileOpen)}
 className="flex items-center gap-2 ml-1.5 p-1.5 pr-2.5 rounded-lg hover:bg-neutral-100 transition-colors"
 >
 <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center">
 <User className="w-3.5 h-3.5 text-white " />
 </div>
 <span className="text-sm font-medium hidden sm:block">Admin</span>
 <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
 </button>

 <AnimatePresence>
 {profileOpen && (
 <motion.div
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 4 }}
 className="absolute top-full right-0 mt-1 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1"
 >
<div className="px-4 py-3 border-b border-border">
<p className="text-sm font-medium">{user?.name ?? 'Admin User'}</p>
<p className="text-xs text-neutral-500">{user?.phone ?? 'Admin'}</p>
</div>
<Link href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors" onClick={() => setProfileOpen(false)}>
<Settings className="w-4 h-4" /> Settings
</Link>
<Link href="/admin/support" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors" onClick={() => setProfileOpen(false)}>
<HelpCircle className="w-4 h-4" /> Help
</Link>
<div className="border-t border-border mt-1 pt-1">
<button
className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
onClick={() => {
setProfileOpen(false);
logout();
router.push('/');
}}
>
<LogOut className="w-4 h-4" /> Sign Out
</button>
</div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </header>
 );
}
