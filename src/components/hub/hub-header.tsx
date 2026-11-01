import { Code2, KeyRound, LayoutGrid, Search } from 'lucide-react'
import { dataModules } from '@/lib/modules'
import { SystemStatusBadge } from './system-status-badge'

interface HubHeaderProps {
  query: string
  onQueryChange: (value: string) => void
}

const highlights = [
  { icon: LayoutGrid, label: `${dataModules.length} módulos de dados` },
  { icon: KeyRound, label: 'Acesso sem cadastro' },
  { icon: Code2, label: 'Código aberto' },
] as const

export function HubHeader({ query, onQueryChange }: HubHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-soft ring-1 ring-slate-900/[0.06] md:p-10">
      {/* Decoração */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 size-64 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-sky-700">Dados abertos para todos</p>
         <SystemStatusBadge />
        </div>

        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Bem-vindo ao{' '}
          <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Bahia Hub</span>
        </h1>
        <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
          Explore os dados da nossa região de forma simples, em um só lugar.
        </p>

        <div role="search" className="relative mt-7 w-full md:max-w-md">
          <label htmlFor="global-search" className="sr-only">
            Buscar módulos de dados
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar dados, ex.: chuva, PIB..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 shadow-soft outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {highlights.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-slate-600">
              <Icon className="size-4 text-sky-600" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}