"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Camera,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUpdateProfile } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { uploadImage } from "@/lib/api/uploads";
import { useToast } from "@/components/ui/Toast";
import { getInitials } from "@/components/UserMenu";
import { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "profile" | "orders";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const inputClass =
  "w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/order/${order.id}`}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border rounded-xl p-5 hover:border-ink/30 transition-colors"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-medium">
            #{order.id.slice(0, 8)}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-widest",
              statusStyles[order.status],
            )}
          >
            {order.status}
          </span>
        </div>
        <p className="text-xs text-muted mt-1.5">
          Placed on {formatDate(order.createdAt)} · {order.items.length}{" "}
          item{order.items.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-lg font-semibold">
          ৳{Number(order.totalAmount).toLocaleString()}
        </span>
        <ChevronRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const [tab, setTab] = useState<Tab>(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("tab") === "orders"
      ? "orders"
      : "profile",
  );
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials = getInitials(user.name);

  const switchTab = (next: Tab) => {
    setTab(next);
    router.replace(next === "orders" ? "/account?tab=orders" : "/account", {
      scroll: false,
    });
  };

  const handleSave = () => {
    updateProfile.mutate(
      { name, address },
      {
        onSuccess: () => toast("Profile updated"),
        onError: (err) => toast(err.message, "error"),
      },
    );
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updateProfile.mutate(
        { image: url },
        {
          onSuccess: () => toast("Profile photo updated"),
          onError: (err) => toast(err.message, "error"),
        },
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="px-page max-w-2xl mx-auto py-10 pb-24">
      <header className="mb-8">
        <span className="font-mono text-muted uppercase tracking-[0.35em] text-[10px] mb-3 block">
          My Account
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-ink tracking-tight leading-none font-bold">
          Hello,{" "}
          <em className="font-light italic">
            {user.name?.split(" ")[0] ?? "there"}
          </em>
        </h1>
      </header>

      <div className="flex gap-2 mb-8">
        <TabButton active={tab === "profile"} onClick={() => switchTab("profile")}>
          <UserIcon className="w-4 h-4" /> Profile
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => switchTab("orders")}>
          <Package className="w-4 h-4" /> Orders
        </TabButton>
      </div>

      {tab === "profile" ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-border bg-paper flex items-center justify-center shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="font-display text-2xl font-semibold">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {uploading ? "Uploading..." : "Change photo"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
              <p className="text-xs text-muted mt-1">
                JPG or PNG, square works best
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                type="text"
                value={user.phone}
                readOnly
                disabled
                className={cn(inputClass, "opacity-60 cursor-not-allowed")}
              />
              <p className="text-[11px] text-muted">
                Phone number is used to sign in and can&apos;t be changed.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Delivery address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House, road, area, city"
                className={cn(inputClass, "resize-none")}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="self-start bg-ink text-white px-8 py-3 rounded-full font-body text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {ordersLoading ? (
            <p className="text-center py-16 text-muted">Loading orders...</p>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <Package className="w-8 h-8 text-ink/20 mx-auto mb-3" />
              <p className="text-ink/70 font-medium mb-1">No orders yet</p>
              <p className="text-sm text-muted mb-5">
                When you place an order it will show up here.
              </p>
              <Link
                href="/products"
                className="inline-block bg-ink text-white px-6 py-3 rounded-full font-body text-sm font-medium"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </motion.section>
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-body text-sm font-medium transition-colors",
        active
          ? "bg-ink text-white border-ink"
          : "border-border text-ink/60 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
