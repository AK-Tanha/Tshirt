"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MotionSection } from "@/components/MotionSection";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { useOrder, useLookupOrder } from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/lib/types";
import { cn, getHeroImage } from "@/lib/utils";
import { CheckCircle2, Package, Phone, MapPin, ChevronLeft, UserPlus } from "lucide-react";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

function OrderDetails({ order }: { order: Order }) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const customerName = order.name ?? order.user?.name ?? "Customer";
  const customerPhone = order.user?.phone ?? order.phone;
  const customerAddress = order.user?.address ?? order.address;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h1 className="font-display text-4xl md:text-5xl text-ink tracking-tight leading-none font-bold">
          Order <em className="font-light italic">placed</em>!
        </h1>
        <p className="font-body text-muted mt-3">
          Thank you, {customerName.split(" ")[0]}. We’ll call{" "}
          <span className="text-ink font-medium">{customerPhone}</span> to confirm
          your delivery.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            Order #{order.id.slice(0, 8)}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest",
              statusStyles[order.status],
            )}
          >
            {order.status}
          </span>
        </div>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone shrink-0">
                <Image
                  src={getHeroImage(item.product.images)?.url ?? "/placeholder.png"}
                  alt={item.product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product.name}</p>
                <p className="text-[11px] text-muted">
                  {item.variant.size} / {item.variant.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-body text-sm">
                ৳{(Number(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span className="text-ink/70">On confirmation</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total (COD)</span>
            <span className="font-display text-xl font-bold">
              ৳{Number(order.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" />
          <div>
            <span className="text-muted block">Delivery address</span>
            <span className="text-ink">{customerAddress}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-ink/40 mt-0.5 shrink-0" />
          <div>
            <span className="text-muted block">Phone</span>
            <span className="text-ink">{customerPhone}</span>
          </div>
        </div>
      </div>

      <p className="text-center font-body text-xs text-muted">
        Save your order number{" "}
        <span className="font-mono text-ink">#{order.id.slice(0, 8)}</span> to
        track it later.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/products"
          className="w-full bg-ink text-white py-4 rounded-full font-body text-sm font-semibold text-center hover:bg-ink/90 transition-colors"
        >
          Continue shopping
        </Link>
        {order.userId && (
          <Link
            href="/account?tab=orders"
            className="w-full border border-border text-ink py-4 rounded-full font-body text-sm font-medium text-center hover:bg-stone transition-colors"
          >
            View my orders
          </Link>
        )}
      </div>
    </div>
  );
}

function GuestOrderView({ order }: { order: Order }) {
  const { user } = useAuthStore();
  const redirect = `/order/${order.id}`;

  return (
    <div className="space-y-6">
      <OrderDetails order={order} />
      {!user && (
        <div className="bg-white border border-border rounded-2xl p-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-stone flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-4 h-4 text-ink" />
          </div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Track this order anytime
          </h2>
          <p className="font-body text-sm text-muted mt-1 mb-4">
            Create an account or sign in and we’ll link this order to your
            profile.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="w-full bg-ink text-white py-3 rounded-full font-body text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              Create an account
            </Link>
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="w-full border border-border text-ink py-3 rounded-full font-body text-sm font-medium hover:bg-stone transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderLookup() {
  const { id } = useParams<{ id: string }>();
  const lookup = useLookupOrder();
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="font-display text-4xl text-ink tracking-tight leading-none font-bold mb-3">
        Track your <em className="font-light italic">order</em>
      </h1>
      <p className="font-body text-muted mb-8">
        Enter the phone number you ordered with to see order{" "}
        <span className="font-mono text-ink">#{id.slice(0, 8)}</span>.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup.mutate({ id, phone });
        }}
        className="bg-white border border-border rounded-2xl p-6 space-y-4 text-left"
      >
        <div>
          <label className="font-body text-sm text-muted mb-2 block">Phone number</label>
          <input
            type="tel"
            required
            placeholder="+880 1XXX XXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-border rounded-xl py-3.5 px-4 bg-white font-body text-sm placeholder:text-muted/40 focus:border-ink outline-none transition-all"
          />
        </div>
        {lookup.error && (
          <p className="text-sm text-red-500 text-center">{lookup.error.message}</p>
        )}
        <button
          type="submit"
          disabled={lookup.isPending}
          className="w-full bg-ink text-white py-4 rounded-full font-body text-sm font-semibold disabled:opacity-50"
        >
          {lookup.isPending ? "Looking up..." : "View order"}
        </button>
      </form>
      {lookup.data && <GuestOrderView order={lookup.data} />}
    </div>
  );
}

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { lastOrder } = useOrderStore();
  const { user } = useAuthStore();

  const stored = lastOrder?.id === id ? lastOrder : null;
  const orderQuery = useOrder(id, !!user && !stored);
  const order = stored ?? orderQuery.data ?? null;

  return (
    <main className="px-page max-w-xl mx-auto py-10 pb-24">
      <MotionSection>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted uppercase tracking-[0.2em] hover:text-ink transition-colors mb-8"
        >
          <ChevronLeft className="w-3 h-3" /> Back to shop
        </Link>
        {order ? (
          <GuestOrderView order={order} />
        ) : orderQuery.isLoading ? (
          <p className="text-center py-24 text-muted">Loading order...</p>
        ) : user ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-ink/20 mx-auto mb-4" />
            <p className="text-ink/70 font-medium">We couldn’t find this order.</p>
            <Link
              href="/account?tab=orders"
              className="inline-block mt-4 text-sm text-ink underline"
            >
              Go to my orders
            </Link>
          </div>
        ) : (
          <OrderLookup />
        )}
      </MotionSection>
    </main>
  );
}
