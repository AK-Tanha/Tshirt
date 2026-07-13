'use client';

import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'default', onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-border w-full max-w-sm"
          >
            <div className="flex items-start gap-4 p-6">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                variant === 'danger' ? 'bg-red-100' : 'bg-stone',
              )}>
                {variant === 'danger' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold">{title}</h3>
                <p className="text-sm text-muted mt-1">{message}</p>
              </div>
              <button onClick={onCancel} className="p-1 hover:bg-stone rounded-lg transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-stone transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-black text-white hover:bg-black/80',
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
