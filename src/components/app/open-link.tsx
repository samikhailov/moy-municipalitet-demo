import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"

/** Кнопка «Открыть» в строке таблицы. */
export function OpenLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} aria-label={`Открыть: ${label}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
      Открыть
    </Link>
  )
}
