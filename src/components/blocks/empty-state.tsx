import * as React from "react"
import { InboxIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Пустой список: иконка, одна фраза, пояснение и действие, если роль может его выполнить. */
function EmptyState({
  title = "Поручений не найдено",
  icon,
  action,
  children,
  className,
}: {
  title?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div role="status" data-slot="empty-state" className={cn("flex flex-col items-center gap-2 px-6 py-10 text-center whitespace-normal", className)}>
      <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-7">
        {icon ?? <InboxIcon aria-hidden="true" />}
      </span>
      <div className="text-base font-medium text-foreground">{title}</div>
      {children ? <div className="max-w-90 text-sm text-muted-foreground">{children}</div> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
