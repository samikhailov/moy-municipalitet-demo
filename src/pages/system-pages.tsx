import { FileQuestionIcon, LockIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/blocks/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const Home = () => (
  <Link to="/" className={buttonVariants()}>
    На главную
  </Link>
)

export function NoAccessPage() {
  return (
    <Card className="p-8">
      <EmptyState icon={<LockIcon aria-hidden="true" />} title="Нет доступа" action={<Home />}>
        Это поручение недоступно для вашей роли.
      </EmptyState>
    </Card>
  )
}

export function NotFoundPage() {
  return (
    <Card className="p-8">
      <EmptyState icon={<FileQuestionIcon aria-hidden="true" />} title="Страница не найдена" action={<Home />}>
        Возможно, поручение было удалено при сбросе демоданных.
      </EmptyState>
    </Card>
  )
}
