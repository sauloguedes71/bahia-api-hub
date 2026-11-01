import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center rounded-xl bg-white p-10 text-center shadow-soft ring-1 ring-slate-900/[0.04]"
    >
      <SearchX className="size-8 text-slate-300" aria-hidden="true" />
      <p className="mt-3 font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}