import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase()
}

/** Один человек: аватар (фото или инициалы); с showName или subtitle — ещё имя и подпись. */
function Person({ name, src, subtitle, showName = false, size = 32, className }: { name: string; src?: string; subtitle?: React.ReactNode; showName?: boolean; size?: number; className?: string }) {
  const avatar = (
    <Avatar style={{ width: size, height: size }} className={subtitle || showName ? undefined : className} title={name}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback style={{ fontSize: Math.round(size * 0.38) }}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
  if (!subtitle && !showName) return avatar
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {avatar}
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {subtitle ? <span className="text-xs text-muted-foreground">{subtitle}</span> : null}
      </span>
    </span>
  )
}

/** Аватары внахлёст с чипом +N. */
function AvatarGroup({ people, max = 4, size = 32, className }: { people: { name: string; src?: string }[]; max?: number; size?: number; className?: string }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <span className={cn("inline-flex -space-x-2 *:ring-2 *:ring-card", className)}>
      {shown.map((p, i) => (
        <Person key={i} name={p.name} src={p.src} size={size} />
      ))}
      {extra > 0 ? (
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-inverse font-semibold text-inverse-foreground"
          style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
        >
          +{extra}
        </span>
      ) : null}
    </span>
  )
}

export { Person, AvatarGroup, initials }
