import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${Number((amount / 1_000_000).toFixed(2))}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${Number((amount / 1_000).toFixed(2))}K`;
  }
  return amount.toLocaleString();
}
