import * as React from "react"
import { CircleAlertIcon, InfoIcon, LogInIcon } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"

import { Brand } from "@/components/blocks/brand"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_LABELS, USERS } from "@/config/users"
import { useStore } from "@/store/store"

/** Экран входа (ТЗ 8.1). Пароль не проверяется — роль определяется только по логину. */
export function LoginPage() {
  const { user, login } = useStore()
  const navigate = useNavigate()
  const [value, setValue] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [tip, setTip] = React.useState(false)

  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
      <Brand />
      <Card className="w-110 max-w-full gap-6 p-8">
        <h1 className="text-xl font-semibold tracking-tight">Вход в систему</h1>
        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            const v = value.trim()
            if (!v) return setError("Укажите логин")
            if (!login(v)) return setError("Пользователь с таким логином не найден")
            navigate("/", { replace: true })
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="login">Логин</Label>
              <span className="relative flex" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
                <button
                  type="button"
                  aria-label="Демонстрационные логины"
                  aria-describedby={tip ? "login-tip" : undefined}
                  onFocus={() => setTip(true)}
                  onBlur={() => setTip(false)}
                  className="flex size-5 cursor-help items-center justify-center rounded-full text-muted-foreground outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <InfoIcon aria-hidden="true" className="size-4" />
                </button>
                {tip ? (
                  <span
                    id="login-tip"
                    role="tooltip"
                    className="absolute top-[calc(100%+8px)] -left-3 z-30 flex w-75 flex-col gap-2 rounded-lg bg-inverse p-3 text-inverse-foreground shadow-(--shadow-popover)"
                  >
                    <span className="text-xs font-medium opacity-80">Демонстрационные логины</span>
                    {USERS.map((u) => (
                      <span key={u.login} className="text-label">
                        <code className="font-mono">{u.login}</code> — <span className="opacity-80">{ROLE_LABELS[u.role]}</span>
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </div>
            <Input
              id="login"
              size="lg"
              autoComplete="username"
              placeholder="Логин"
              value={value}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
              onChange={(e) => {
                setValue(e.target.value)
                setError("")
              }}
            />
            {error ? (
              <p id="login-error" role="alert" className="flex items-center gap-1.5 text-label text-destructive">
                <CircleAlertIcon aria-hidden="true" className="size-4" />
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" size="lg" type="password" autoComplete="current-password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full text-sm">
            <LogInIcon aria-hidden="true" />
            Войти
          </Button>
        </form>
      </Card>
    </div>
  )
}
