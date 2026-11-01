import { moduleRoutes } from '@/lib/module-routes'

const total = moduleRoutes.length
const available = moduleRoutes.filter((m) => m.url).length

export function SystemStatusBadge() {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200"
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
      </span>
      {available} de {total} módulos disponíveis
    </span>
  )
}