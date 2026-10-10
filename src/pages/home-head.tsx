import { PageTitle } from "@/components/app/app-layout"
import { DueCell } from "@/components/app/due-cell"
import { Section } from "@/components/app/section"
import { StatTile } from "@/components/app/stat-tile"
import { TaskTable, titleColumn } from "@/components/app/task-table"
import { formatDate, formatDateTime, todayISO } from "@/lib/dates"
import { useStore, visibleTasks } from "@/store/store"
import { countByStatus, lastMonth, shareOf } from "@/pages/home-curator"

const byDue = (x: { dueDate: string }, y: { dueDate: string }) => x.dueDate.localeCompare(y.dueDate)

export function HeadHome() {
  const { user, tasks } = useStore()
  const mine = visibleTasks(user!, tasks)
  const total = countByStatus(lastMonth(mine))
  const share = (n: number) => `${shareOf(n, total.all)}% поручений муниципалитета`

  return (
    <>
      <PageTitle title="Главная" subtitle="Сводка за последние 30 дней" />

      <div className="grid grid-cols-4 gap-6">
        <StatTile label="Всего поручений" value={total.all} note={user!.municipality!} dotClass="bg-foreground" />
        <StatTile label="На распределение" value={total.a} note={share(total.a)} dotClass="bg-status-assign" />
        <StatTile label="В работе" value={total.w} note={share(total.w)} dotClass="bg-status-work" />
        <StatTile label="Исполнено" value={total.d} note={share(total.d)} dotClass="bg-status-done" />
      </div>

      <Section title="Ожидают распределения">
        <TaskTable
          tasks={mine.filter((t) => t.status === "assign").sort(byDue)}
          empty="Все поручения распределены"
          columns={[
            titleColumn,
            { header: "Куратор", width: "240px", cell: (t) => t.curatorName },
            { header: "Срок исполнения", width: "170px", cell: (t) => <DueCell dueDate={t.dueDate} /> },
          ]}
        />
      </Section>

      <Section title="В работе">
        <TaskTable
          tasks={mine.filter((t) => t.status === "work").sort(byDue)}
          empty="Поручений в работе нет"
          columns={[
            titleColumn,
            { header: "Куратор", width: "220px", cell: (t) => t.curatorName },
            { header: "Исполнитель", width: "220px", cell: (t) => t.executorName ?? "—" },
            { header: "Срок исполнения", width: "170px", cell: (t) => <DueCell dueDate={t.dueDate} /> },
          ]}
        />
      </Section>
    </>
  )
}

export function ManagerHome() {
  const { user, tasks } = useStore()
  const mine = visibleTasks(user!, tasks)
  const inWork = mine.filter((t) => t.status === "work").sort(byDue)
  const done = mine
    .filter((t) => t.status === "done")
    .sort((x, y) => (y.completedAt ?? "").localeCompare(x.completedAt ?? ""))
  const overdue = inWork.filter((t) => t.dueDate < todayISO()).length

  return (
    <>
      <PageTitle title="Главная" subtitle="Сводка за последние 30 дней" />

      <div className="grid grid-cols-4 gap-6">
        <StatTile label="Назначено мне" value={mine.length} note={user!.municipality!} dotClass="bg-foreground" />
        <StatTile label="В работе" value={inWork.length} note="Ожидают исполнения" dotClass="bg-status-work" />
        <StatTile label="Исполнено" value={done.length} note="За всё время" dotClass="bg-status-done" />
        <StatTile
          label="Просрочено"
          value={overdue}
          note="Срок истёк, не исполнено"
          dotClass="bg-destructive"
          valueClass={overdue > 0 ? "text-destructive" : undefined}
        />
      </div>

      <Section title="В работе">
        <TaskTable
          tasks={inWork}
          empty="Поручений в работе нет"
          columns={[
            titleColumn,
            { header: "Куратор", width: "240px", cell: (t) => t.curatorName },
            { header: "Срок исполнения", width: "170px", cell: (t) => <DueCell dueDate={t.dueDate} /> },
          ]}
        />
      </Section>

      <Section title="Исполнено недавно">
        <TaskTable
          tasks={done.slice(0, 5)}
          empty="Исполненных поручений пока нет"
          columns={[
            titleColumn,
            { header: "Куратор", width: "250px", cell: (t) => t.curatorName },
            { header: "Срок исполнения", width: "150px", cell: (t) => <span className="tabular-nums">{formatDate(t.dueDate)}</span> },
            {
              header: "Исполнено",
              width: "170px",
              cell: (t) => <span className="tabular-nums">{t.completedAt ? formatDateTime(t.completedAt) : "—"}</span>,
            },
          ]}
        />
      </Section>
    </>
  )
}
