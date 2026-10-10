const pad = (n: number) => String(n).padStart(2, "0")

/** Сегодняшняя дата в формате YYYY-MM-DD (локальное время). */
export function todayISO(now = new Date()) {
  return toISODate(now)
}

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, days: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + days)
  return r
}

/** ДД.ММ.ГГГГ */
export function formatDate(isoOrDate: string | Date) {
  const d = typeof isoOrDate === "string" ? (isoOrDate.length === 10 ? fromISODate(isoOrDate) : new Date(isoOrDate)) : isoOrDate
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

/** ДД.ММ.ГГГГ, ЧЧ:ММ */
export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${formatDate(d)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
