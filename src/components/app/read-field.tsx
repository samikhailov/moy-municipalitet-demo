import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Поле «только чтение»: значение на bg-muted (README дизайн-системы, «Состояния»). */
export function ReadField({ label, value, multiline = false, className }: { label: string; value: React.ReactNode; multiline?: boolean; className?: string }) {
  const id = React.useId()
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label id={id}>{label}</Label>
      <div
        role="textbox"
        aria-readonly="true"
        aria-labelledby={id}
        className={cn("rounded-md bg-muted px-3 text-sm text-foreground", multiline ? "py-2.5 leading-5 whitespace-pre-line" : "flex min-h-10 items-center")}
      >
        {value}
      </div>
    </div>
  )
}
