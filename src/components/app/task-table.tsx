import * as React from "react"

import { EmptyState } from "@/components/blocks/empty-state"
import { OpenLink } from "@/components/app/open-link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Task } from "@/data/seed"

export type Column = {
  header: string
  /** Ширина колонки (CSS), без неё колонка тянется. */
  width?: string
  align?: "right"
  cell: (t: Task) => React.ReactNode
}

/** Таблица поручений с кнопкой «Открыть» в последней колонке. */
export function TaskTable({ tasks, columns, empty }: { tasks: Task[]; columns: Column[]; empty: string }) {
  if (tasks.length === 0) return <EmptyState title={empty} />
  return (
    <Table className="table-fixed">
      <colgroup>
        {columns.map((c, i) => (
          <col key={i} style={c.width ? { width: c.width } : undefined} />
        ))}
        <col style={{ width: "112px" }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHead key={c.header} className={c.align === "right" ? "text-right" : undefined}>
              {c.header}
            </TableHead>
          ))}
          <TableHead>
            <span className="sr-only">Действие</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t) => (
          <TableRow key={t.id}>
            {columns.map((c) => (
              <TableCell key={c.header} className={c.align === "right" ? "text-right whitespace-normal" : "whitespace-normal"}>
                {c.cell(t)}
              </TableCell>
            ))}
            <TableCell>
              <OpenLink to={`/tasks/${t.id}`} label={t.title} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const titleColumn: Column = { header: "Название", cell: (t) => <span className="font-medium">{t.title}</span> }
