import { ChevronDownIcon, ClipboardListIcon, HouseIcon, LogOutIcon, RotateCcwIcon } from "lucide-react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"

import { Brand } from "@/components/blocks/brand"
import { initials } from "@/components/blocks/avatar-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ROLE_LABELS } from "@/config/users"
import { cn } from "@/lib/utils"
import { useStore } from "@/store/store"

const navItemClass = (active: boolean) =>
  cn(
    "flex h-10 items-center gap-3 rounded-md px-3 text-base font-medium transition-colors outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-5",
    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
  )

/** Каркас страниц после входа: боковое меню и шапка с пользователем. */
export function AppLayout() {
  const { user, logout, resetDemo } = useStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onTask = pathname.startsWith("/tasks/")
  if (!user) return null

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-66 shrink-0 border-r border-border bg-sidebar">
      <nav aria-label="Основное меню" className="sticky top-0 flex h-screen flex-col gap-6 px-4 py-5">
        <Brand className="px-2" />
        <div className="flex flex-col gap-1">
          <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>
            <HouseIcon aria-hidden="true" />
            Главная
          </NavLink>
          {/* Экрана списка поручений в демо нет: пункт не ведёт никуда, но выделен на создании и карточке поручения. */}
          <button type="button" className={cn(navItemClass(onTask), "text-left")} aria-current={onTask ? "page" : undefined}>
            <ClipboardListIcon aria-hidden="true" />
            Поручения
          </button>
        </div>
        <div className="flex-1" />
        <Button
          variant="ghost"
          className="justify-start px-3"
          onClick={() => {
            if (window.confirm("Вернуть демонстрационные данные к исходному состоянию? Созданные и изменённые поручения будут удалены.")) {
              resetDemo()
              navigate("/")
            }
          }}
        >
          <RotateCcwIcon aria-hidden="true" />
          Сбросить демоданные
        </Button>
      </nav>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-18 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-8">
          <div className="text-sm text-muted-foreground">{user.municipality ?? "Чувашская Республика"}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-13 gap-3 pr-2 pl-1.5 text-foreground">
                <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {initials(user.name)}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
                <Badge variant="info">{ROLE_LABELS[user.role]}</Badge>
                <ChevronDownIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-55">
              <DropdownMenuItem
                onSelect={() => {
                  logout()
                  navigate("/login")
                }}
              >
                <LogOutIcon aria-hidden="true" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageTitle({ title, subtitle, action, badge }: { title: string; subtitle?: string; action?: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4">
          <h1 className="text-title font-semibold tracking-tight">{title}</h1>
          {badge}
        </div>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
