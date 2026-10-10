import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { AppLayout } from "@/components/app/app-layout"
import { CreateTaskPage } from "@/pages/create-task"
import { CuratorHome } from "@/pages/home-curator"
import { HeadHome, ManagerHome } from "@/pages/home-head"
import { LoginPage } from "@/pages/login-page"
import { NoAccessPage, NotFoundPage } from "@/pages/system-pages"
import { TaskPage } from "@/pages/task-page"
import { useStore } from "@/store/store"

function RequireAuth() {
  const { user } = useStore()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <AppLayout />
}

function Home() {
  const { user } = useStore()
  if (user?.role === "curator") return <CuratorHome />
  if (user?.role === "head") return <HeadHome />
  return <ManagerHome />
}

function CuratorOnly({ children }: { children: React.ReactNode }) {
  const { user } = useStore()
  return user?.role === "curator" ? children : <NoAccessPage />
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Home />} />
        <Route path="tasks/new" element={<CuratorOnly><CreateTaskPage /></CuratorOnly>} />
        <Route path="tasks/:id" element={<TaskPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
