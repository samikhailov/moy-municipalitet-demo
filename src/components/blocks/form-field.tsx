import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type ControlProps = {
  id: string
  "aria-invalid"?: true
  "aria-required"?: true
  "aria-describedby"?: string
}

/**
 * Label + control + hint/error, wired for screen readers.
 * children: one element (Input, Textarea…) that receives the props below,
 * or a function (props) => node — use it for Select, passing the props to SelectTrigger.
 */
function FormField({
  label,
  required,
  hint,
  error,
  id,
  className,
  children,
}: {
  label?: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  id?: string
  className?: string
  children: React.ReactElement | ((props: ControlProps) => React.ReactNode)
}) {
  const autoId = React.useId()
  const fieldId = id ?? `field-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  const messageId = `${fieldId}-message`
  const message = error || hint
  const controlProps: ControlProps = {
    id: fieldId,
    ...(error ? { "aria-invalid": true } : {}),
    ...(required ? { "aria-required": true } : {}),
    ...(message ? { "aria-describedby": messageId } : {}),
  }
  const control =
    typeof children === "function"
      ? children(controlProps)
      : React.cloneElement(children, controlProps as Record<string, unknown>)

  return (
    <div data-slot="form-field" data-invalid={error ? "" : undefined} className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={fieldId}>
          {label}
          {required ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {control}
      {message ? (
        <p id={messageId} role={error ? "alert" : undefined} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

export { FormField }
export type { ControlProps as FormFieldControlProps }
