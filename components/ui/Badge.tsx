import { cn } from '@/lib/utils';

interface BadgeProps {
 children: React.ReactNode;
 variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
 className?: string;
}

const variants = {
 default: 'bg-neutral-900 text-white ',
 success: 'bg-emerald-100 text-emerald-700 ',
 warning: 'bg-amber-100 text-amber-700 ',
 danger: 'bg-red-100 text-red-700 ',
 info: 'bg-blue-100 text-blue-700 ',
 neutral: 'bg-neutral-100 text-neutral-600 ',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
 return (
 <span className={cn(
 'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full',
 variants[variant],
 className,
 )}>
 {children}
 </span>
 );
}
