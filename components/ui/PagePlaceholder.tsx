'use client';

import { Card } from './Card';
import { Construction } from 'lucide-react';

export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
      </div>
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Construction className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="font-display text-base font-semibold mb-1">Coming Soon</h3>
          <p className="text-sm text-neutral-500 max-w-sm">
            {description || 'This section is under development and will be available soon.'}
          </p>
        </div>
      </Card>
    </div>
  );
}
