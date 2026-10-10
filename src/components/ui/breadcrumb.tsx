import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="Навигационная цепочка" data-slot="breadcrumb" {...props} />
}
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-2 text-sm text-muted-foreground", className)} {...props} />
}
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-2", className)} {...props} />
}
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }>(function BreadcrumbLink(
  { asChild, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : "a"
  return <Comp ref={ref} data-slot="breadcrumb-link" className={cn("transition-colors hover:text-foreground hover:underline", className)} {...props} />
})
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />
}
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("text-faint", className)} {...props}>
      {children ?? "/"}
    </li>
  )
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
