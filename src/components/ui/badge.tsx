import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        info: "bg-primary-soft text-primary",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        destructive: "bg-destructive-soft text-destructive",
        "destructive-solid": "bg-destructive text-destructive-foreground",
        inverse: "bg-inverse text-inverse-foreground",
        outline: "border border-border text-foreground",
        count: "h-5 min-w-5 justify-center rounded-full px-1.5 py-0 leading-none bg-primary-soft text-primary",
        "count-solid": "h-5 min-w-5 justify-center rounded-full px-1.5 py-0 leading-none bg-primary text-primary-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, variant, asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : "span"
  return <Comp ref={ref} data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
})

export { Badge, badgeVariants }
