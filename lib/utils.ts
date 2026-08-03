import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ProductImage } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs))
}

// Product image helpers — a product can have one "hero" image (thumbnail / og
// / first gallery slot) plus additional gallery images.
export function getHeroImage(images?: ProductImage[] | null): ProductImage | undefined {
 if (!images || images.length === 0) return undefined
 return images.find((img) => img.isHero) ?? images[0]
}

// Order gallery images with the hero first, then the rest in original order.
export function orderImages(images?: ProductImage[] | null): ProductImage[] {
 if (!images || images.length === 0) return []
 const hero = getHeroImage(images)
 if (!hero) return images
 return [hero, ...images.filter((img) => img.id !== hero.id)]
}
