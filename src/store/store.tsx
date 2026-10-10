import * as React from "react"

import { findUser, type User } from "@/config/users"
import { generateSeed, type Task } from "@/data/seed"
import type { Municipality } from "@/lib/municipalities"

// Всё хранится в localStorage браузера (ТЗ, раздел 12).
const KEYS = { version: "mm.version", tasks: "mm.tasks", session: "mm.session" }
/** Увеличьте, если поменялась структура данных: старые данные будут заменены демоданными. */
const DATA_VERSION = "1"

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* хранилище недоступно — данные живут до перезагрузки */
  }
}

function loadTasks(): Task[] {
  const version = read<string>(KEYS.version)
  const tasks = read<Task[]>(KEYS.tasks)
  if (version === DATA_VERSION && Array.isArray(tasks)) return tasks
  const seed = generateSeed()
  write(KEYS.version, DATA_VERSION)
  write(KEYS.tasks, seed)
  return seed
}

export type NewTask = { title: string; description: string; dueDate: string; municipality: Municipality; attachment: string | null }

type Store = {
  user: User | null
  tasks: Task[]
  login: (login: string) => User | null
  logout: () => void
  createTask: (t: NewTask) => Task
  assignExecutor: (id: string, executor: { name: string; login?: string }) => void
  completeTask: (id: string) => void
  setAttachment: (id: string, name: string) => void
  resetDemo: () => void
}

const StoreContext = React.createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>(loadTasks)
  const [user, setUser] = React.useState<User | null>(() => {
    const login = read<string>(KEYS.session)
    return login ? findUser(login) ?? null : null
  })

  React.useEffect(() => write(KEYS.tasks, tasks), [tasks])

  const patch = React.useCallback((id: string, fn: (t: Task) => Partial<Task>) => {
    const now = new Date().toISOString()
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, ...fn(t), updatedAt: now } : t)))
  }, [])

  const value = React.useMemo<Store>(
    () => ({
      user,
      tasks,
      login(login) {
        const found = findUser(login) ?? null
        if (found) {
          write(KEYS.session, found.login)
          setUser(found)
        }
        return found
      },
      logout() {
        write(KEYS.session, null)
        setUser(null)
      },
      createTask(input) {
        const now = new Date().toISOString()
        const max = tasks.reduce((m, t) => Math.max(m, Number(t.id.slice(2)) || 0), 0)
        const task: Task = {
          id: `T-${String(max + 1).padStart(4, "0")}`,
          ...input,
          curatorLogin: user!.login,
          curatorName: user!.name,
          executorName: null,
          executorLogin: null,
          status: "assign",
          createdAt: now,
          updatedAt: now,
          completedAt: null,
        }
        setTasks((all) => [task, ...all])
        return task
      },
      assignExecutor(id, executor) {
        patch(id, () => ({ executorName: executor.name, executorLogin: executor.login ?? null, status: "work" }))
      },
      completeTask(id) {
        patch(id, (t) => (t.status === "work" ? { status: "done", completedAt: new Date().toISOString() } : {}))
      },
      setAttachment(id, name) {
        patch(id, () => ({ attachment: name || null }))
      },
      resetDemo() {
        const seed = generateSeed()
        write(KEYS.version, DATA_VERSION)
        setTasks(seed)
      },
    }),
    [user, tasks, patch]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore вне StoreProvider")
  return ctx
}

/** Поручения, доступные пользователю (ТЗ, раздел 7). */
export function visibleTasks(user: User, tasks: Task[]) {
  if (user.role === "curator") return tasks
  if (user.role === "head") return tasks.filter((t) => t.municipality === user.municipality)
  return tasks.filter((t) => t.executorLogin === user.login)
}

export function canOpenTask(user: User, task: Task) {
  return visibleTasks(user, [task]).length > 0
}
