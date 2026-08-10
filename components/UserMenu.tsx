"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  User as UserIcon,
  Package,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function getInitials(name?: string | null): string {
  if (!name) return "A";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink/70 hover:text-ink hover:bg-surface rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className={cn(
          "w-8 h-8 rounded-full overflow-hidden ring-1 ring-border flex items-center justify-center bg-paper text-ink transition-all",
          open && "ring-ink/40",
        )}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Account"}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-mono text-[11px] font-medium leading-none">
            {initials}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-56 bg-paper border border-border rounded-xl shadow-lg p-1.5"
          >
            <div className="px-3 py-2.5 border-b border-border mb-1">
              <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              <p className="text-xs text-muted">{user.phone}</p>
            </div>
            <MenuItem
              href="/account"
              icon={<UserIcon className="w-4 h-4" />}
              label="Profile"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              href="/account?tab=orders"
              icon={<Package className="w-4 h-4" />}
              label="My Orders"
              onClick={() => setOpen(false)}
            />
            {user.role === "ADMIN" && (
              <MenuItem
                href="/admin"
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Admin Dashboard"
                onClick={() => setOpen(false)}
              />
            )}
            <button
              onClick={() => {
                setOpen(false);
                logout();
                router.push("/");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink/70 hover:text-ink hover:bg-surface rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
