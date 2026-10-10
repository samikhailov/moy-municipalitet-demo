import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** Показатель на главной: точка цвета статуса, подпись, крупное число и пояснение. */
export function StatTile({ label, value, note, dotClass, valueClass }: { label: string; value: number; note: string; dotClass: string; valueClass?: string }) {
  return (
    <Card className="gap-3 p-6">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={cn("size-2 rounded-full", dotClass)} />
        <span className="text-label font-medium text-muted-foreground">{label}</span>
      </div>
      <div className={cn("text-metric font-semibold tracking-tight tabular-nums", valueClass)}>{value}</div>
      <div className="text-xs text-muted-foreground">{note}</div>
    </Card>
  )
}
