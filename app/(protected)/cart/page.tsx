"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";

export default function CartPage() {
  const router = useRouter();
  const setOpen = useCartDrawerStore((s) => s.setOpen);

  useEffect(() => {
    setOpen(true);
    router.replace("/");
  }, [setOpen, router]);

  return null;
}
