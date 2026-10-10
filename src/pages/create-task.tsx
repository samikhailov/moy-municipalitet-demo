import * as React from "react"
import { CircleCheckIcon, SendIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { PageTitle } from "@/components/app/app-layout"
import { DatePicker } from "@/components/blocks/date-picker"
import { FileField } from "@/components/blocks/file-field"
import { FormField } from "@/components/blocks/form-field"
import { Alert } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { todayISO } from "@/lib/dates"
import { MUNICIPALITIES, type Municipality } from "@/lib/municipalities"
import { useStore } from "@/store/store"

type Errors = Partial<Record<"title" | "desc" | "due" | "muni", string>>

const EMPTY = { title: "", desc: "", due: "", muni: "", file: "" }

/** Создание поручения (только куратор). Новое поручение получает статус «На распределение». */
export function CreateTaskPage() {
  const { createTask } = useStore()
  const [form, setForm] = React.useState(EMPTY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [created, setCreated] = React.useState<{ id: string; muni: string } | null>(null)

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    setCreated(null)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Errors = {}
    if (!form.title.trim()) errs.title = "Укажите название"
    if (!form.desc.trim()) errs.desc = "Укажите описание"
    if (!form.due) errs.due = "Укажите срок исполнения"
    else if (form.due < todayISO()) errs.due = "Срок не может быть раньше сегодняшней даты"
    if (!form.muni) errs.muni = "Выберите муниципалитет"
    setErrors(errs)
    if (Object.keys(errs).length) {
      setCreated(null)
      return
    }
    const task = createTask({
      title: form.title.trim(),
      description: form.desc.trim(),
      dueDate: form.due,
      municipality: form.muni as Municipality,
      attachment: form.file || null,
    })
    setCreated({ id: task.id, muni: form.muni })
    setForm(EMPTY)
  }

  return (
    <>
      <PageTitle title="Создание поручения" />

      {created ? (
        <Alert variant="success" className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <CircleCheckIcon aria-hidden="true" className="size-5 shrink-0 text-success" />
            <span>
              <span className="font-semibold">Поручение создано.</span> Оно направлено в {created.muni} со статусом «На распределение».
            </span>
          </span>
          <Link to="/" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            На главную
          </Link>
        </Alert>
      ) : null}

      <Card className="gap-6 p-8">
        <form noValidate onSubmit={submit} className="flex flex-col gap-6">
          <FormField label="Название" required error={errors.title}>
            <Input placeholder="Кратко сформулируйте поручение" value={form.title} onChange={(e) => set("title")(e.target.value)} />
          </FormField>
          <FormField label="Описание" required error={errors.desc}>
            <Textarea rows={5} className="min-h-32" placeholder="Опишите, что нужно сделать" value={form.desc} onChange={(e) => set("desc")(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Срок исполнения" required error={errors.due}>
              {(p) => <DatePicker {...p} value={form.due} onChange={set("due")} minDate={new Date(new Date().setHours(0, 0, 0, 0))} />}
            </FormField>
            <FormField label="Муниципалитет" required error={errors.muni}>
              {(p) => (
                <Select value={form.muni} onValueChange={set("muni")}>
                  <SelectTrigger {...p}>
                    <SelectValue placeholder="Выберите муниципалитет" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {MUNICIPALITIES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
          </div>
          <FileField label="Вложения" fileName={form.file} onFileNameChange={set("file")} />
          <div className="h-px bg-border" />
          <div className="flex justify-end gap-3">
            <Link to="/" className={buttonVariants({ variant: "secondary" })}>
              Отмена
            </Link>
            <Button type="submit">
              <SendIcon aria-hidden="true" />
              Создать
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}
