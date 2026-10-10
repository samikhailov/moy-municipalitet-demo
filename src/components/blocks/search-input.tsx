import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"

/** Filled search field with a leading icon: «Поиск по названию». Needs aria-label when there is no FormField label. */
function SearchInput({ className, size, ...props }: InputProps) {
  return (
    <div data-slot="search-input" className={cn("relative w-full", className)}>
      <SearchIcon aria-hidden="true" className={cn("pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-muted-foreground", size === "lg" ? "left-4" : "left-3")} />
      <Input type="search" size={size} className={cn("border-transparent bg-muted", size === "lg" ? "pl-11" : "pl-10")} {...props} />
    </div>
  )
}

export { SearchInput }
