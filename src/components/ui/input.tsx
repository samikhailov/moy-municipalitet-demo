import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
  /** Height matches Button: default 40px, lg 48px (login form). */
  size?: "default" | "lg"
}

// read-only fields render as a value on bg-muted, not as a greyed-out input.
const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type, size = "default", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm text-foreground transition-colors outline-none placeholder:text-faint",
        "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive",
        "read-only:cursor-default read-only:border-transparent read-only:bg-muted",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        size === "lg" ? "h-12 px-4 text-base" : "h-10",
        className
      )}
      {...props}
    />
  )
})

export { Input }
export type { InputProps }
