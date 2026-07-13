import { cn } from "@/lib/utils";

interface GarmentTagProps {
 size: string;
 color: string;
 sku: string;
 className?: string;
}

export const GarmentTag = ({ size, color, sku, className }: GarmentTagProps) => {
 return (
 <div className={cn("border border-slate/40 p-4 font-mono text-[9px] text-navy uppercase inline-block tracking-widest relative bg-bone", className)}>
 <div className="flex justify-between items-start mb-3">
 <span className="bg-navy text-bone px-1">Authentic</span>
 <span className="text-slate/40">Lot #2026-A</span>
 </div>
 <div className="flex flex-col gap-1 mb-3">
 <div className="flex justify-between">
 <span className="text-slate/40">Size:</span>
 <span className="font-bold">{size}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate/40">Color:</span>
 <span className="font-bold">{color}</span>
 </div>
 </div>
 <div className="border-t border-slate/20 pt-2 flex justify-between items-center">
 <span>ID: {sku}</span>
 <div className="w-16 h-4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-barcode.svg')] bg-cover opacity-20" />
 </div>
 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-navy/20 translate-x-1 -translate-y-1" />
 </div>
 );
};
