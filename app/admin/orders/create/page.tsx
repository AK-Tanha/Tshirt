'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CreateOrderPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Create Order</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6 text-neutral-500" />
        </div>
        <h2 className="font-display text-lg font-bold">Orders come from the storefront</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Orders are placed by customers through the checkout flow and appear here automatically.
          Use the order details page to advance their status.
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
