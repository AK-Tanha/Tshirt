'use client';

import { useState } from 'react';
import { Save, Store, Phone, MapPin, CreditCard, Bell, Shield } from 'lucide-react';

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('Apan Apparel');
  const [storeEmail, setStoreEmail] = useState('hello@apanapparel.com');
  const [storePhone, setStorePhone] = useState('+880 1700-000000');
  const [storeAddress, setStoreAddress] = useState('Dhaka, Bangladesh');
  const [currency, setCurrency] = useState('BDT');
  const [codEnabled, setCodEnabled] = useState(true);
  const [orderNotification, setOrderNotification] = useState(true);
  const [stockAlert, setStockAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-stone flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Store Information</h2>
              <p className="text-xs text-muted">Manage your store details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">Phone</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">Address</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-stone flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Payment</h2>
              <p className="text-xs text-muted">Payment method configuration</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm outline-none focus:border-black transition-colors"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-muted">Accept COD payments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={codEnabled} onChange={(e) => setCodEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-stone flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Notifications</h2>
              <p className="text-xs text-muted">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Order Alert</p>
                <p className="text-xs text-muted">Get notified when a new order is placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={orderNotification} onChange={(e) => setOrderNotification(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-xs text-muted">Get notified when stock runs low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={stockAlert} onChange={(e) => setStockAlert(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
