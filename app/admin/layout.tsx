"use client";

import { ToastProvider } from "@/components/ui/Toast";
import AdminShell from "@/components/admin/AdminShell";
import { RequireRole } from "@/components/RequireRole";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <RequireRole role="ADMIN">
        <AdminShell>{children}</AdminShell>
      </RequireRole>
    </ToastProvider>
  );
}
