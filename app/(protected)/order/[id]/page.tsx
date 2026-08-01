import { MotionSection } from '@/components/MotionSection';
import { getOrder } from '@/lib/api/orders';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api-client';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order;
  try {
    order = await getOrder(id);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) notFound();
    order = null;
  }

  if (!order) {
    return (
      <main className="max-w-md mx-auto px-4 pb-12 md:pb-24 text-center">
        <MotionSection>
          <h1 className="font-display text-4xl mb-6">ORDER PLACED</h1>
          <p className="font-body text-slate mb-8">
            Order #{id} was submitted. We will call you soon to confirm.
          </p>
        </MotionSection>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 pb-12 md:pb-24 text-center">
      <MotionSection>
        <h1 className="font-display text-4xl mb-6">THANK YOU!</h1>
        <p className="font-body text-slate mb-8">
          Order #{order.id.slice(0, 8)} received. We will call you soon to confirm.
        </p>
        <div className="text-left border border-border rounded-xl p-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Order</span>
            <span className="font-mono">#{order.id.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Status</span>
            <span>{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Total</span>
            <span className="font-bold">৳{Number(order.totalAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Items</span>
            <span>{order.items.length}</span>
          </div>
        </div>
      </MotionSection>
    </main>
  );
}
