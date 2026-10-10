import * as React from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * Крупное число для обзорных экранов.
 * trend — только направление стрелки; tone — оценка и цвет (по умолчанию up → positive, down → negative).
 */
function StatCard({
  label,
  value,
  icon,
  delta,
  trend = "up",
  tone,
  caption,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.ReactNode
  delta?: React.ReactNode
  trend?: "up" | "down"
  tone?: "positive" | "negative" | "neutral"
  caption?: React.ReactNode
  className?: string
}) {
  const t = tone ?? (trend === "up" ? "positive" : "negative")
  const Arrow = trend === "down" ? TrendingDownIcon : TrendingUpIcon
  return (
    <Card data-slot="stat-card" className={cn("min-w-60 gap-4 p-5", className)}>
      <div className="flex items-center gap-3 text-sm font-medium">
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary [&_svg]:size-4.5">{icon}</span>
        ) : null}
        <span className="flex-1">{label}</span>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              t === "positive" && "text-success",
              t === "negative" && "text-destructive",
              t === "neutral" && "text-muted-foreground"
            )}
          >
            <Arrow aria-hidden="true" className="size-4" />
            {delta}
          </span>
        ) : null}
      </div>
      <div>
        <div className="text-metric font-semibold tracking-tight">{value}</div>
        {caption ? <div className="mt-1 text-xs text-muted-foreground">{caption}</div> : null}
      </div>
    </Card>
  )
}

export { StatCard }
