import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<"textarea">>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-faint",
        "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-invalid:border-destructive",
        "read-only:resize-none read-only:border-transparent read-only:bg-muted",
        "disabled:cursor-not-allowed disabled:bg-muted",
        className
      )}
      {...props}
    />
  )
})

export { Textarea }
