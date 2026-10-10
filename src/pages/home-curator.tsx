import { PlusIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { PageTitle } from "@/components/app/app-layout"
import { DueCell } from "@/components/app/due-cell"
import { Section } from "@/components/app/section"
import { StatTile } from "@/components/app/stat-tile"
import { TaskTable, titleColumn } from "@/components/app/task-table"
import { StatusBadge } from "@/components/blocks/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Task } from "@/data/seed"
import { addDays } from "@/lib/dates"
import { MUNICIPALITIES } from "@/lib/municipalities"
import { useStore } from "@/store/store"

/** Поручения, созданные за последние 30 дней — по ним строится сводка. */
export function lastMonth(tasks: Task[]) {
  const from = addDays(new Date(), -30).toISOString()
  return tasks.filter((t) => t.createdAt >= from)
}

export function countByStatus(tasks: Task[]) {
  const a = tasks.filter((t) => t.status === "assign").length
  const w = tasks.filter((t) => t.status === "work").length
  const d = tasks.filter((t) => t.status === "done").length
  return { a, w, d, all: a + w + d }
}

export function shareOf(n: number, all: number) {
  return all ? Math.round((n / all) * 100) : 0
}

const LEGEND = [
  ["На распределение", "bg-status-assign"],
  ["В работе", "bg-status-work"],
  ["Исполнено", "bg-status-done"],
] as const

export function CuratorHome() {
  const { tasks } = useStore()
  const month = lastMonth(tasks)
  const total = countByStatus(month)
  const share = (n: number) => `${shareOf(n, total.all)}% от всех поручений`

  const nearest = tasks
    .filter((t) => t.status !== "done")
    .sort((x, y) => x.dueDate.localeCompare(y.dueDate))
    .slice(0, 5)

  const rows = MUNICIPALITIES.map((name) => ({ name, ...countByStatus(month.filter((t) => t.municipality === name)) }))

  return (
    <>
      <PageTitle
        title="Главная"
        subtitle="Сводка за последние 30 дней"
        action={
          <Link to="/tasks/new" className={buttonVariants()}>
            <PlusIcon aria-hidden="true" />
            Создать поручение
          </Link>
        }
      />

      <div className="grid grid-cols-4 gap-6">
        <StatTile label="Всего поручений" value={total.all} note="По 23 муниципалитетам" dotClass="bg-foreground" />
        <StatTile label="На распределение" value={total.a} note={share(total.a)} dotClass="bg-status-assign" />
        <StatTile label="В работе" value={total.w} note={share(total.w)} dotClass="bg-status-work" />
        <StatTile label="Исполнено" value={total.d} note={share(total.d)} dotClass="bg-status-done" />
      </div>

      <Section title="Ближайшие сроки">
        <TaskTable
          tasks={nearest}
          empty="Неисполненных поручений нет"
          columns={[
            titleColumn,
            { header: "Муниципалитет", width: "220px", cell: (t) => t.municipality },
            { header: "Срок исполнения", width: "170px", cell: (t) => <DueCell dueDate={t.dueDate} /> },
            { header: "Статус", width: "190px", cell: (t) => <StatusBadge status={t.status} /> },
          ]}
        />
      </Section>

      <Section
        title="Сводка по муниципалитетам"
        description="Распределение поручений по статусам за последние 30 дней"
        action={
          <div className="flex gap-4 self-end text-xs text-muted-foreground">
            {LEGEND.map(([label, dot]) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        }
      >
        <Table className="table-fixed tabular-nums">
          <colgroup>
            <col style={{ width: "240px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "80px" }} />
            <col />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Муниципалитет</TableHead>
              <TableHead className="text-right">На распределение</TableHead>
              <TableHead className="text-right">В работе</TableHead>
              <TableHead className="text-right">Исполнено</TableHead>
              <TableHead className="text-right">Всего</TableHead>
              <TableHead>Доля по статусам</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-right font-medium text-status-assign">{r.a}</TableCell>
                <TableCell className="text-right font-medium text-status-work">{r.w}</TableCell>
                <TableCell className="text-right font-medium text-status-done">{r.d}</TableCell>
                <TableCell className="text-right font-medium">{r.all}</TableCell>
                <TableCell>
                  <span
                    role="img"
                    aria-label={`На распределение ${r.a}, в работе ${r.w}, исполнено ${r.d}`}
                    className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted"
                  >
                    {r.a ? <span className="bg-status-assign" style={{ flex: `${r.a} 1 0px` }} /> : null}
                    {r.w ? <span className="bg-status-work" style={{ flex: `${r.w} 1 0px` }} /> : null}
                    {r.d ? <span className="bg-status-done" style={{ flex: `${r.d} 1 0px` }} /> : null}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-0">
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold">Итого по республике</TableCell>
              <TableCell className="text-right font-semibold text-status-assign">{total.a}</TableCell>
              <TableCell className="text-right font-semibold text-status-work">{total.w}</TableCell>
              <TableCell className="text-right font-semibold text-status-done">{total.d}</TableCell>
              <TableCell className="text-right font-semibold">{total.all}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Section>
    </>
  )
}
