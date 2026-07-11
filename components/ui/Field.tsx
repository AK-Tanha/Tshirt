'use client';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, required, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export const inputBase = "w-full px-4 py-2.5 bg-white border rounded-lg text-sm outline-none transition-all duration-200 placeholder:text-muted/60";
export const inputNormal = "border-border focus:border-black focus:ring-1 focus:ring-black/10";
export const inputError = "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200";
export const inputDisabled = "disabled:bg-stone disabled:text-muted disabled:cursor-not-allowed";

export function getInputClass(error?: string, extra?: string) {
  return cn(inputBase, error ? inputError : inputNormal, inputDisabled, extra);
}

export const selectBase = "w-full px-4 py-2.5 bg-white border rounded-lg text-sm outline-none transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a3a3a3%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";
