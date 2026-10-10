import * as React from "react"
import { FileTextIcon, PaperclipIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FormField } from "@/components/blocks/form-field"

/**
 * Вложение: «Выбрать файл» + имя файла. Файл не загружается — наружу отдаётся только имя (onFileNameChange).
 * Доступно всем трём ролям, поэтому режима «только чтение» нет.
 */
function FileField({
  label = "Вложение",
  fileName,
  defaultFileName = "",
  onFileNameChange,
  hint,
  error,
  disabled,
  className,
}: {
  label?: React.ReactNode
  fileName?: string
  defaultFileName?: string
  onFileNameChange?: (name: string) => void
  hint?: React.ReactNode
  error?: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  const [inner, setInner] = React.useState(defaultFileName)
  const name = fileName ?? inner
  return (
    <FormField label={label} hint={hint} error={error} className={className}>
      {(p) => (
        <div className="relative flex flex-wrap items-center gap-3">
          <input
            {...p}
            type="file"
            disabled={disabled}
            aria-describedby={cn(`${p.id}-name`, p["aria-describedby"])}
            className="peer absolute size-px overflow-hidden opacity-0"
            onChange={(e) => {
              const n = e.target.files?.[0]?.name ?? ""
              if (fileName === undefined) setInner(n)
              onFileNameChange?.(n)
            }}
          />
          <label
            htmlFor={p.id}
            aria-hidden="true"
            className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer peer-focus-visible:outline-solid peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring")}
          >
            <PaperclipIcon className="size-4.5" />
            Выбрать файл
          </label>
          {name ? (
            <span id={`${p.id}-name`} className="inline-flex items-center gap-1.5 text-sm font-medium">
              <FileTextIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              {name}
            </span>
          ) : (
            <span id={`${p.id}-name`} className="text-sm text-muted-foreground">
              Файл не выбран
            </span>
          )}
        </div>
      )}
    </FormField>
  )
}

export { FileField }
