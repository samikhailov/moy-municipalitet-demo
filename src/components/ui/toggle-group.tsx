import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"

// Segmented control: selected item is an inverse pill.
function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1", className)}
      {...props}
    />
  )
}
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full px-4 text-label font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground",
        "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-[state=on]:bg-inverse data-[state=on]:text-inverse-foreground",
        className
      )}
      {...props}
    />
  )
})

export { ToggleGroup, ToggleGroupItem }
