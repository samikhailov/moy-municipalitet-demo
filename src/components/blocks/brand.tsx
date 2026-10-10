import { LandmarkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Название продукта с иконкой Landmark в квадрате primary. */
function Brand({ name = "Мой Муниципалитет", className }: { name?: string; className?: string }) {
  return (
    <div data-slot="brand" className={cn("flex items-center gap-3 text-base font-semibold text-foreground", className)}>
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <LandmarkIcon className="size-5" />
      </span>
      {name}
    </div>
  )
}

export { Brand }
