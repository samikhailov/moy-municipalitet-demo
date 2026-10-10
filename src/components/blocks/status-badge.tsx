import * as React from "react"

import { cn } from "@/lib/utils"
import { TASK_STATUSES, type TaskStatus } from "@/lib/municipalities"

const styles: Record<TaskStatus, { soft: string; text: string }> = {
  assign: { soft: "bg-status-assign-soft", text: "text-status-assign" },
  work: { soft: "bg-status-work-soft", text: "text-status-work" },
  done: { soft: "bg-status-done-soft", text: "text-status-done" },
}

/** Статус поручения — всегда со словом и точкой цвета статуса. */
function StatusBadge({ status, size = "default", className, ...props }: React.ComponentProps<"span"> & { status: TaskStatus; size?: "default" | "lg" }) {
  const s = styles[status]
  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-sm font-medium whitespace-nowrap before:size-1.5 before:rounded-full before:bg-current",
        size === "lg" ? "h-7 px-2.5 text-label" : "h-6 px-2 text-xs",
        s.soft,
        s.text,
        className
      )}
      {...props}
    >
      {TASK_STATUSES[status]}
    </span>
  )
}

export { StatusBadge, styles as statusStyles }
