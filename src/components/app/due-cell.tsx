import { ClockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { formatDate, todayISO } from "@/lib/dates"
import { cn } from "@/lib/utils"

/** Срок исполнения с пометками «Просрочено» и «Срок сегодня» (для неисполненных поручений). */
export function DueCell({ dueDate, done = false }: { dueDate: string; done?: boolean }) {
  const today = todayISO()
  const overdue = !done && dueDate < today
  const isToday = !done && dueDate === today
  return (
    <span className="flex flex-col items-start gap-1">
      <span className={cn("tabular-nums", overdue && "text-destructive")}>{formatDate(dueDate)}</span>
      {overdue ? <Badge variant="destructive-solid" className="px-1.5 py-0.5">Просрочено</Badge> : null}
      {isToday ? (
        <Badge variant="neutral" className="px-1.5 py-0.5 text-foreground">
          <ClockIcon aria-hidden="true" />
          Срок сегодня
        </Badge>
      ) : null}
    </span>
  )
}
