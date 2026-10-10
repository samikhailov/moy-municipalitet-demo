import type { Municipality } from "@/lib/municipalities"

// Демонстрационные пользователи (ТЗ, раздел 4). Логины и ФИО можно менять здесь.
export type Role = "curator" | "head" | "manager"

export type User = {
  login: string
  name: string
  role: Role
  /** Муниципалитет главы и управляющего делами; у куратора — все. */
  municipality?: Municipality
}

export const ROLE_LABELS: Record<Role, string> = {
  curator: "Куратор",
  head: "Глава муниципалитета",
  manager: "Управляющий делами",
}

export const USERS: User[] = [
  { login: "curator", name: "Смирнова Елена Викторовна", role: "curator" },
  { login: "glava", name: "Николаев Сергей Петрович", role: "head", municipality: "Моргаушский МО" },
  { login: "manager", name: "Ильина Ольга Андреевна", role: "manager", municipality: "Моргаушский МО" },
]

/** Исполнители, которых глава может назначить в своём муниципалитете (первый — управляющий делами). */
export const EXECUTORS: { name: string; login?: string }[] = [
  { name: "Ильина Ольга Андреевна", login: "manager" },
  { name: "Васильев Дмитрий Игоревич" },
  { name: "Фёдорова Марина Сергеевна" },
]

export function findUser(login: string) {
  return USERS.find((u) => u.login === login.trim())
}

export function shortName(full: string) {
  const [last, first, middle] = full.split(" ")
  return [last, first ? `${first[0]}.` : "", middle ? `${middle[0]}.` : ""].filter(Boolean).join(" ")
}
