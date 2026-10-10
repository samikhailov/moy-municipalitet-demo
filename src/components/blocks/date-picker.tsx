import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate, fromISODate, toISODate } from "@/lib/dates"
import { cn } from "@/lib/utils"

/** Выбор даты (shadcn/ui Date Picker): кнопка-поле + календарь в поповере. Значение — YYYY-MM-DD. */
export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = "Выберите дату",
  ...aria
}: {
  value: string
  onChange: (iso: string) => void
  minDate?: Date
  placeholder?: string
  id?: string
  "aria-invalid"?: true
  "aria-describedby"?: string
  "aria-required"?: true
}) {
  const [open, setOpen] = React.useState(false)
  const selected = value ? fromISODate(value) : undefined
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          {...aria}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-card px-3 text-left text-sm transition-colors outline-none",
            "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive",
            value ? "text-foreground" : "text-faint"
          )}
        >
          <CalendarIcon aria-hidden="true" className="size-4.5 text-muted-foreground" />
          <span className="tabular-nums">{value ? formatDate(value) : placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label="Выбор срока исполнения">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          disabled={minDate ? { before: minDate } : undefined}
          onSelect={(d) => {
            if (!d) return
            onChange(toISODate(d))
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
