import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Custom font-size keys from globals.css (text-title, text-metric, text-label)
// must be registered, or tailwind-merge treats them as colors and drops e.g. text-muted-foreground.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["title", "metric", "label"] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
