import { Search } from 'lucide-react'

type HubHeaderProps = {
  query: string
  onQueryChange: (value: string) => void
}

export function HubHeader({ query, onQueryChange }: HubHeaderProps) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-sky-600">Dados abertos para todos</p>
          <span
            role="status"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Ao vivo: Sistemas online
          </span>
        </div>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
          Bem-vindo ao Bahia API Hub
        </h1>
        <p className="mt-2 text-pretty text-lg text-slate-500">Explore os dados da nossa região.</p>
      </div>

      <div role="search" className="relative w-full md:w-80">
        <label htmlFor="global-search" className="sr-only">
          Buscar módulos de dados
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar dados, ex.: chuva, PIB..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-soft outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
        />
      </div>
    </header>
  )
}
