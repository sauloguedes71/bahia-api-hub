import { Layers, Map as MapIcon, MapPin, RefreshCw, TriangleAlert, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useAsync } from '@/hooks/use-async'
import { getBahiaTerritorio } from '@/lib/api/ibge'
import type { BahiaTerritorio } from '@/lib/api/types'

const number = new Intl.NumberFormat('pt-BR')

const items: readonly { key: keyof BahiaTerritorio; label: string; icon: LucideIcon }[] = [
  { key: 'municipios', label: 'Municípios', icon: MapPin },
  { key: 'mesorregioes', label: 'Mesorregiões', icon: MapIcon },
  { key: 'microrregioes', label: 'Microrregiões', icon: Layers },
]

export function BahiaStats() {
  const { state, reload } = useAsync(getBahiaTerritorio)

  return (
    <section aria-labelledby="stats-title" className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="stats-title" className="text-lg font-semibold text-slate-800">
          A Bahia em números
        </h2>
        <p className="text-sm text-slate-500">Fonte: IBGE</p>
      </div>

      <div className="mt-4" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && (
          <ul role="status" aria-label="Carregando dados do IBGE" className="grid gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <li key={item.key} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-900/[0.06]">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="mt-4 h-7 w-20" />
                <Skeleton className="mt-2 h-4 w-28" />
              </li>
            ))}
          </ul>
        )}

        {state.status === 'error' && (
          <div role="alert" className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-red-200 sm:flex-row sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">Não foi possível carregar os dados do IBGE</p>
              <p className="text-sm text-slate-600">{state.error.message}</p>
            </div>
            <Button variant="outline" onClick={reload}>
              <RefreshCw aria-hidden="true" />
              Tentar novamente
            </Button>
          </div>
        )}

        {state.status === 'success' &&
          (state.data.municipios === 0 ? (
            <EmptyState title="Sem dados disponíveis" description="O IBGE não retornou informações para a Bahia." />
          ) : (
            <dl className="grid gap-4 sm:grid-cols-3">
              {items.map(({ key, label, icon: Icon }) => (
                <div key={key} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-900/[0.06]">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <dd className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                    {number.format(state.data[key])}
                  </dd>
                  <dt className="text-sm text-slate-600">{label}</dt>
                </div>
              ))}
            </dl>
          ))}
      </div>
    </section>
  )
}