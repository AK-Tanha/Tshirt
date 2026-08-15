'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSite, useUpdateSite } from '@/hooks/use-site';
import { Save, Store, CreditCard, Bell, Shield, Globe, FileText, Mail, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'admin_settings';
type Tab = 'general' | 'payment' | 'notifications' | 'email';

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
 { key: 'general', label: 'General', icon: Store },
 { key: 'payment', label: 'Payment', icon: CreditCard },
 { key: 'notifications', label: 'Notifications', icon: Bell },
 { key: 'email', label: 'Email', icon: Mail },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
 return (
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
 <div className="w-10 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-neutral-900 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
 </label>
 );
}

const DEFAULTS = {
  storeEmail: 'hello@apanapparel.com',
  storePhone: '+880 1700-000000',
  storeAddress: 'Dhaka, Bangladesh',
  currency: 'BDT',
  codEnabled: true,
  orderNotification: true,
  stockAlert: true,
};

function loadSettings() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>('general');
  const [storeName, setStoreName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [storeEmail, setStoreEmail] = useState(DEFAULTS.storeEmail);
  const [storePhone, setStorePhone] = useState(DEFAULTS.storePhone);
  const [storeAddress, setStoreAddress] = useState(DEFAULTS.storeAddress);
  const [currency, setCurrency] = useState(DEFAULTS.currency);
  const [codEnabled, setCodEnabled] = useState(DEFAULTS.codEnabled);
  const [orderNotification, setOrderNotification] = useState(DEFAULTS.orderNotification);
  const [stockAlert, setStockAlert] = useState(DEFAULTS.stockAlert);
  const { data: site, isLoading: siteLoading } = useSite();
  const { mutate: saveSite, isPending: saving } = useUpdateSite();
  const { toast } = useToast();

  useEffect(() => {
    const stored = loadSettings();
    if (!stored) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoreEmail(stored.storeEmail ?? DEFAULTS.storeEmail);
    setStorePhone(stored.storePhone ?? DEFAULTS.storePhone);
    setStoreAddress(stored.storeAddress ?? DEFAULTS.storeAddress);
    setCurrency(stored.currency ?? DEFAULTS.currency);
    setCodEnabled(stored.codEnabled ?? DEFAULTS.codEnabled);
    setOrderNotification(stored.orderNotification ?? DEFAULTS.orderNotification);
    setStockAlert(stored.stockAlert ?? DEFAULTS.stockAlert);
  }, []);

 const nameValue = storeName || site?.siteName || '';
 const logoValue = logoUrl || site?.logoUrl || '';

 const handleSave = () => {
 const settings = { storeEmail, storePhone, storeAddress, currency, codEnabled, orderNotification, stockAlert };
 localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
 saveSite(
   { siteName: nameValue, logoUrl: logoValue || undefined },
   {
   onSuccess: () => toast('Settings saved successfully'),
   onError: (err: { message?: string }) => toast(err?.message || 'Failed to save settings', 'error'),
   },
 );
 };

 return (
 <div className="space-y-6 max-w-4xl">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
 <p className="text-sm text-neutral-500 mt-1">Manage your store configuration</p>
 </div>
 <button
 onClick={handleSave}
 disabled={saving || siteLoading}
 className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
 {saving ? 'Saving...' : 'Save Changes'}
 </button>
 </div>

 <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
 {tabs.map((t) => (
 <button
 key={t.key}
 onClick={() => setTab(t.key)}
 className={cn(
 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
 tab === t.key
 ? 'bg-white text-neutral-900 shadow-sm'
 : 'text-neutral-500 hover:text-neutral-900 ',
 )}
 >
 <t.icon className="w-4 h-4" />
 {t.label}
 </button>
 ))}
 </div>

 {tab === 'general' && (
 <Card className="p-6">
 <CardHeader>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><Store className="w-4.5 h-4.5" /></div>
 <div>
 <CardTitle>Store Information</CardTitle>
 <p className="text-xs text-neutral-500">Manage your store details</p>
 </div>
 </div>
 </CardHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Store Name</label>
 <input type="text" value={nameValue} onChange={(e) => setStoreName(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Logo URL</label>
 <input type="text" value={logoValue} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://.../logo.png" className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Email</label>
 <input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Phone</label>
 <input type="text" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Address</label>
 <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 </div>
 </Card>
 )}

 {tab === 'payment' && (
 <Card className="p-6">
 <CardHeader>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><CreditCard className="w-4.5 h-4.5" /></div>
 <div>
 <CardTitle>Payment</CardTitle>
 <p className="text-xs text-neutral-500">Payment method configuration</p>
 </div>
 </div>
 </CardHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">Currency</label>
 <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all">
 <option value="BDT">BDT (৳)</option>
 <option value="USD">USD ($)</option>
 </select>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium">Cash on Delivery</p>
 <p className="text-xs text-neutral-500">Accept COD payments</p>
 </div>
 <Toggle checked={codEnabled} onChange={setCodEnabled} />
 </div>
 </div>
 </Card>
 )}

 {tab === 'notifications' && (
 <Card className="p-6">
 <CardHeader>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><Bell className="w-4.5 h-4.5" /></div>
 <div>
 <CardTitle>Notifications</CardTitle>
 <p className="text-xs text-neutral-500">Manage notification preferences</p>
 </div>
 </div>
 </CardHeader>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium">New Order Alert</p>
 <p className="text-xs text-neutral-500">Get notified when a new order is placed</p>
 </div>
 <Toggle checked={orderNotification} onChange={setOrderNotification} />
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium">Low Stock Alert</p>
 <p className="text-xs text-neutral-500">Get notified when stock runs low</p>
 </div>
 <Toggle checked={stockAlert} onChange={setStockAlert} />
 </div>
 </div>
 </Card>
 )}

 {tab === 'email' && (
 <Card className="p-6">
 <CardHeader>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center"><Mail className="w-4.5 h-4.5" /></div>
 <div>
 <CardTitle>Email Configuration</CardTitle>
 <p className="text-xs text-neutral-500">SMTP and email template settings</p>
 </div>
 </div>
 </CardHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">SMTP Host</label>
 <input type="text" defaultValue="smtp.sendgrid.net" className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">SMTP Port</label>
 <input type="text" defaultValue="587" className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">From Email</label>
 <input type="email" defaultValue="noreply@apanapparel.com" className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 <div>
 <label className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1.5 block">From Name</label>
 <input type="text" defaultValue="APAN Apparel" className="w-full px-4 py-2.5 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-neutral-300 transition-all" />
 </div>
 </div>
 </Card>
 )}
 </div>
 );
}
