import * as React from "react"
import { CircleCheckIcon, FileTextIcon, PaperclipIcon, SendIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { PageTitle } from "@/components/app/app-layout"
import { ReadField } from "@/components/app/read-field"
import { Section } from "@/components/app/section"
import { FileField } from "@/components/blocks/file-field"
import { FormField } from "@/components/blocks/form-field"
import { StatusBadge } from "@/components/blocks/status-badge"
import { Alert } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXECUTORS } from "@/config/users"
import type { Task } from "@/data/seed"
import { formatDate, formatDateTime } from "@/lib/dates"
import { canOpenTask, useStore } from "@/store/store"
import { NoAccessPage, NotFoundPage } from "@/pages/system-pages"

/** Карточка поручения. Содержимое блока действий зависит от роли (ТЗ, разделы 7 и 8). */
export function TaskPage() {
  const { id = "" } = useParams()
  const { user, tasks } = useStore()
  const task = tasks.find((t) => t.id === id)
  const [notice, setNotice] = React.useState<React.ReactNode>(null)

  if (!task) return <NotFoundPage />
  if (!canOpenTask(user!, task)) return <NoAccessPage />

  return (
    <>
      <PageTitle title="Поручение" badge={<StatusBadge status={task.status} size="lg" />} />

      {notice ? (
        <Alert variant="success">
          <CircleCheckIcon aria-hidden="true" />
          <div>{notice}</div>
        </Alert>
      ) : null}

      <TaskInfo task={task} showExecutor={user!.role !== "head"} />

      {user!.role === "head" ? <AssignSection task={task} onDone={setNotice} /> : null}
      {user!.role === "manager" ? <ExecutionSection task={task} onDone={setNotice} /> : null}
      {user!.role === "curator" ? <AttachmentSection task={task} onDone={setNotice} /> : null}
    </>
  )
}

function TaskInfo({ task, showExecutor }: { task: Task; showExecutor: boolean }) {
  return (
    <Section title="Сведения о поручении">
      <div className="flex flex-col gap-5">
        <ReadField label="Название" value={task.title} />
        <ReadField label="Описание" value={task.description} multiline />
        <div className="flex flex-col gap-2">
          <span className="text-label font-medium text-muted-foreground">Вложения</span>
          {task.attachment ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              <FileTextIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              {task.attachment}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <PaperclipIcon aria-hidden="true" className="size-4" />
              Вложений нет
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ReadField label="Срок исполнения" value={formatDate(task.dueDate)} />
          <ReadField label="Муниципалитет" value={task.municipality} />
          <ReadField label="Куратор" value={task.curatorName} className="col-span-2 col-start-1" />
          {showExecutor && task.executorName ? <ReadField label="Исполнитель" value={task.executorName} className="col-span-2 col-start-1" /> : null}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ReadField label="Дата создания" value={formatDateTime(task.createdAt)} />
          <ReadField label="Дата изменения" value={formatDateTime(task.updatedAt)} />
          {task.completedAt ? <ReadField label="Дата исполнения" value={formatDateTime(task.completedAt)} /> : null}
        </div>
      </div>
    </Section>
  )
}

type Props = { task: Task; onDone: (n: React.ReactNode) => void }

/** Вложение: файл не загружается, сохраняется только имя (ТЗ, раздел 9). */
function useAttachment(task: Task, onDone: Props["onDone"]) {
  const { setAttachment } = useStore()
  const [file, setFile] = React.useState("")
  return {
    file,
    setFile,
    /** Сохраняет выбранный файл. Возвращает true, если файл был выбран. */
    save() {
      if (!file) return false
      setAttachment(task.id, file)
      setFile("")
      return true
    },
    field: (
      <FileField
        label="Вложения"
        fileName={file}
        onFileNameChange={setFile}
        hint={task.attachment && file ? "Новый файл заменит текущее вложение" : undefined}
      />
    ),
    saveNow: (
      <Button
        type="button"
        variant="secondary"
        disabled={!file}
        onClick={() => {
          setAttachment(task.id, file)
          onDone(
            <>
              <span className="font-semibold">Вложение сохранено:</span> {file}.
            </>
          )
          setFile("")
        }}
      >
        Сохранить вложение
      </Button>
    ),
  }
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-px bg-border" />
      <div className="flex justify-end gap-3">{children}</div>
    </>
  )
}

const Cancel = () => (
  <Link to="/" className={buttonVariants({ variant: "secondary" })}>
    Отмена
  </Link>
)

function AssignSection({ task, onDone }: Props) {
  const { assignExecutor } = useStore()
  const [executor, setExecutor] = React.useState("")
  const [error, setError] = React.useState(false)
  const att = useAttachment(task, onDone)
  const editable = task.status === "assign"

  return (
    <Section title="Распределение" description={editable ? "Назначьте исполнителя и передайте поручение в работу" : "Поручение передано в работу"}>
      <div className="grid grid-cols-3 gap-4">
        {editable ? (
          <FormField label="Исполнитель" required error={error ? "Выберите исполнителя" : undefined} className="col-span-2">
            {(p) => (
              <Select
                value={executor}
                onValueChange={(v) => {
                  setExecutor(v)
                  setError(false)
                }}
              >
                <SelectTrigger {...p}>
                  <SelectValue placeholder="Выберите исполнителя" />
                </SelectTrigger>
                <SelectContent>
                  {EXECUTORS.map((e) => (
                    <SelectItem key={e.name} value={e.name}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        ) : (
          <ReadField label="Исполнитель" value={task.executorName ?? "—"} className="col-span-2" />
        )}
        <div className="col-span-3">{att.field}</div>
      </div>
      <Actions>
        {editable ? (
          <>
            <Cancel />
            <Button
              onClick={() => {
                const ex = EXECUTORS.find((e) => e.name === executor)
                if (!ex) return setError(true)
                att.save()
                assignExecutor(task.id, ex)
                onDone(
                  <>
                    <span className="font-semibold">Поручение передано в работу.</span> Исполнитель: {ex.name}.
                  </>
                )
              }}
            >
              <SendIcon aria-hidden="true" />
              Передать в работу
            </Button>
          </>
        ) : (
          att.saveNow
        )}
      </Actions>
    </Section>
  )
}

function ExecutionSection({ task, onDone }: Props) {
  const { completeTask } = useStore()
  const att = useAttachment(task, onDone)
  const inWork = task.status === "work"

  return (
    <Section title="Исполнение" description={inWork ? "После завершения работы отметьте поручение исполненным" : "Поручение исполнено"}>
      {att.field}
      <Actions>
        {inWork ? (
          <>
            <Cancel />
            <Button
              onClick={() => {
                att.save()
                completeTask(task.id)
                onDone(<span className="font-semibold">Поручение отмечено исполненным.</span>)
              }}
            >
              <CircleCheckIcon aria-hidden="true" />
              Отметить исполненным
            </Button>
          </>
        ) : (
          att.saveNow
        )}
      </Actions>
    </Section>
  )
}

function AttachmentSection({ task, onDone }: Props) {
  const att = useAttachment(task, onDone)
  return (
    <Section title="Вложения" description="Куратор может приложить файл к поручению">
      {att.field}
      <Actions>{att.saveNow}</Actions>
    </Section>
  )
}
