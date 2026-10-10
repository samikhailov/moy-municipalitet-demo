import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ru } from "react-day-picker/locale"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Календарь shadcn/ui (react-day-picker) в токенах дизайн-системы. Русская локаль, неделя с понедельника. */
function Calendar({ className, classNames, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ru}
      weekStartsOn={1}
      showOutsideDays={false}
      className={cn("w-68", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "z-10"),
        button_next: cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "z-10"),
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-sm font-semibold capitalize",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "flex-1 pb-1 text-center text-xs font-medium text-muted-foreground capitalize",
        week: "flex w-full gap-0.5 pt-0.5",
        day: "flex-1 p-0 text-center",
        day_button:
          "mx-auto flex size-9 items-center justify-center rounded-md text-sm tabular-nums transition-colors outline-none hover:bg-muted focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-default disabled:hover:bg-transparent",
        today: "[&>button]:bg-primary-soft [&>button]:font-semibold [&>button]:text-primary",
        selected: "[&>button]:bg-primary! [&>button]:font-semibold [&>button]:text-primary-foreground!",
        disabled: "[&>button]:text-faint",
        outside: "invisible",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeftIcon aria-hidden="true" className="size-4" /> : <ChevronRightIcon aria-hidden="true" className="size-4" />,
      }}
      {...props}
    />
  )
}

export { Calendar }
