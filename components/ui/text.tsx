import { cn } from '@/lib/utils';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'secondary' | 'tertiary' | 'label';
type TextColor = 'primary' | 'body' | 'secondary' | 'tertiary' | 'accent' | 'inherit';

interface TextProps {
 as?: React.ElementType;
 variant?: TextVariant;
 color?: TextColor;
 className?: string;
 children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
 h1: 'font-display text-2xl md:text-3xl font-bold tracking-tight',
 h2: 'font-display text-xl md:text-2xl font-bold tracking-tight',
 h3: 'font-display text-lg font-bold',
 body: 'text-sm',
 secondary: 'text-sm',
 tertiary: 'text-xs',
 label: 'text-xs uppercase tracking-wider font-medium',
};

const colorStyles: Record<TextColor, string> = {
 primary: 'text-text-primary',
 body: 'text-text-body',
 secondary: 'text-text-secondary',
 tertiary: 'text-text-tertiary',
 accent: 'text-accent',
 inherit: '',
};

export function Text({ as, variant = 'body', color = 'body', className, children }: TextProps) {
 const Tag = as || (variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p');
 return (
 <Tag className={cn(variantStyles[variant], colorStyles[color], className)}>
 {children}
 </Tag>
 );
}
