'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon: React.ElementType;
  color: string;
  index?: number;
}

export function KPICard({ title, value, subtitle, change, icon: Icon, color, index = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-border p-4 md:p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {change !== undefined && (
          <span className={cn(
            "flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full",
            change >= 0
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
              : "text-red-600 bg-red-50 dark:bg-red-950/30",
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{title}</p>
      {subtitle && <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
