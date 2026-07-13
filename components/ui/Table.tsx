'use client';

import { cn } from '@/lib/utils';

interface Column<T> {
 key: string;
 header: string;
 render: (item: T) => React.ReactNode;
 className?: string;
 hideOn?: 'mobile' | 'tablet';
}

interface TableProps<T> {
 columns: Column<T>[];
 data: T[];
 onRowClick?: (item: T) => void;
 emptyMessage?: string;
}

export function Table<T extends { id: string }>({ columns, data, onRowClick, emptyMessage = 'No data found' }: TableProps<T>) {
 return (
 <div className="bg-white rounded-xl border border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50 ">
 {columns.map((col) => (
 <th
 key={col.key}
 className={cn(
 'p-4 font-medium',
 col.hideOn === 'mobile' && 'hidden md:table-cell',
 col.hideOn === 'tablet' && 'hidden lg:table-cell',
 col.className,
 )}
 >
 {col.header}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {data.map((item) => (
 <tr
 key={item.id}
 className={cn(
 'border-t border-border text-sm transition-colors',
 onRowClick && 'cursor-pointer hover:bg-neutral-50 ',
 )}
 onClick={() => onRowClick?.(item)}
 >
 {columns.map((col) => (
 <td
 key={col.key}
 className={cn(
 'p-4',
 col.hideOn === 'mobile' && 'hidden md:table-cell',
 col.hideOn === 'tablet' && 'hidden lg:table-cell',
 )}
 >
 {col.render(item)}
 </td>
 ))}
 </tr>
 ))}
 {data.length === 0 && (
 <tr>
 <td colSpan={columns.length} className="p-12 text-center text-sm text-neutral-500">
 {emptyMessage}
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}
