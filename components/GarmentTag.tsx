import { cn } from "@/lib/utils";

interface GarmentTagProps {
  size: string;
  color: string;
  sku: string;
  className?: string;
}

export const GarmentTag = ({ size, color, sku, className }: GarmentTagProps) => {
  return (
    <div className={cn("border border-slate p-2 font-mono text-[11px] text-navy uppercase inline-block tracking-[0.08em]", className)}>
      <div className="flex gap-2">
        <span>SZ: {size}</span>
        <span>COL: {color}</span>
      </div>
      <div className="border-t border-slate mt-1 pt-1">
        SKU: {sku}
      </div>
    </div>
  );
};
