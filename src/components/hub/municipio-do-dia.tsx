import { useCallback, useState } from 'react'
import { MapPin, RefreshCw, Shuffle, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useAsync } from '@/hooks/use-async'
import { getMunicipioStats, getMunicipiosBahia } from '@/lib/api/ibge'
import type { Municipio } from '@/lib/api/types'
import { getMunicipioResumo } from '@/lib/api/wikipedia'
import { curiosidades } from '@/lib/curiosidades'
import { MunicipioMapas } from './municipio-maps'

// Dia atual no fuso da Bahia. 7919 é primo e não divide 417, então todos os municípios entram no rodízio.
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bahia' })
const dayNumber = Math.floor(Date.parse(today) / 86_400_000)
const pickOfTheDay = (length: number): number => (dayNumber * 7919) % length

const integer = new Intl.NumberFormat('pt-BR')
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const format = (value: number | null, formatter: Intl.NumberFormat): string =>
  value === null ? '—' : formatter.format(value)

const card = 'overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-900/[0.06]'

interface MunicipioCardProps {
  municipio: Municipio
  isDrawn: boolean
  onDraw: () => void
  onReset: () => void
}

function MunicipioCard({ municipio: m, isDrawn, onDraw, onReset }: MunicipioCardProps) {
  const loadStats = useCallback(() => getMunicipioStats(m.id), [m.id])
  const loadResumo = useCallback(() => getMunicipioResumo(m.nome), [m.nome])
  const stats = useAsync(loadStats).state
  const resumo = useAsync(loadResumo).state
  const [photoFailed, setPhotoFailed] = useState(false)

  const curiosity: string | undefined = curiosidades[m.id]
  const photo = resumo.status === 'success' && resumo.data ? resumo.data.imagem : null
  const showPhoto = photo !== null && !photoFailed
  const values = stats.status === 'success' ? stats.data : null
  const regions = [m.microrregiao && `Microrregião de ${m.microrregiao}`, m.mesorregiao && `Mesorregião ${m.mesorregiao}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={card}>
      {/* Faixa com foto (cores fixas: o texto fica branco sobre a foto nos dois temas) */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-500 to-emerald-500 sm:h-60">
        {showPhoto && (
          <img
            src={photo}
            alt={`Foto de ${m.nome}`}
            decoding="async"
            onError={() => setPhotoFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {!showPhoto && <MapPin className="absolute right-6 top-6 size-24 text-[#ffffff33]" aria-hidden="true" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617cc] via-[#02061733] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6" aria-live="polite">
          <span className="inline-flex rounded-full bg-[#ffffff2e] px-3 py-1 text-xs font-medium text-[#ffffff] ring-1 ring-[#ffffff40] backdrop-blur">
            {isDrawn ? 'Município sorteado' : 'Município do dia'}
          </span>
          <h3 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-[#ffffff] sm:text-4xl">{m.nome}</h3>
          {regions && <p className="mt-1 text-sm text-[#ffffffcc]">{regions}</p>}
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_auto]">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{curiosity ? 'Curiosidade' : 'Sobre o município'}</h4>
          <div className="mt-2 text-sm leading-relaxed text-slate-600">
            {curiosity ? (
              <p>{curiosity}</p>
            ) : resumo.status === 'loading' ? (
              <div role="status" aria-label="Carregando descrição" className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : resumo.status === 'success' && resumo.data ? (
              <>
                <p>{resumo.data.texto}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Texto e foto:{' '}
                  <a
                    href={resumo.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                  >
                    Wikipédia (CC BY-SA)
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </p>
              </>
            ) : (
              <p>
                Ainda não temos uma descrição para este município.{' '}
                <a
                  href={`https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(`${m.nome} Bahia`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-slate-800"
                >
                  Buscar na Wikipédia<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </p>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'População (Censo 2022)', value: format(values?.populacao ?? null, integer), unit: '' },
              { label: 'Área', value: format(values?.areaKm2 ?? null, decimal), unit: ' km²' },
              { label: 'Densidade', value: format(values?.densidade ?? null, decimal), unit: ' hab/km²' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-900/[0.04]">
                <dd className="text-lg font-semibold tracking-tight text-slate-900">
                  {stats.status === 'loading' ? (
                    <Skeleton className="h-6 w-16" />
                  ) : (
                    <>
                      {value}
                      {value !== '—' && <span className="text-xs font-normal text-slate-500">{unit}</span>}
                    </>
                  )}
                </dd>
                <dt className="mt-0.5 text-xs text-slate-500">{label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={onDraw}>
              <Shuffle aria-hidden="true" />
              Sortear outro
            </Button>
            {isDrawn && (
              <Button variant="ghost" onClick={onReset}>
                Voltar ao município do dia
              </Button>
            )}
            <span className="text-xs text-slate-500">Código IBGE {m.id}</span>
          </div>
        </div>

        <MunicipioMapas id={m.id} nome={m.nome} />
      </div>
    </div>
  )
}

export function MunicipioDoDia() {
  const { state, reload } = useAsync(getMunicipiosBahia)
  const [drawn, setDrawn] = useState<number | null>(null)

  return (
    <section aria-labelledby="municipio-title" className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="municipio-title" className="text-lg font-semibold text-slate-800">
          Conheça a Bahia
        </h2>
        <p className="text-sm text-slate-500">Fontes: IBGE e Wikipédia</p>
      </div>

      <div className="mt-4" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && (
          <div role="status" aria-label="Carregando município" className={card}>
            <Skeleton className="h-60 w-full rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div role="alert" className="flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-red-200 sm:flex-row sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="font-medium text-slate-800">Não foi possível carregar os municípios</p>
              <p className="text-sm text-slate-600">{state.error.message}</p>
            </div>
            <Button variant="outline" onClick={reload}>
              <RefreshCw aria-hidden="true" />
              Tentar novamente
            </Button>
          </div>
        )}

        {state.status === 'success' &&
          (state.data.length === 0 ? (
            <EmptyState title="Sem municípios disponíveis" description="O IBGE não retornou dados para a Bahia." />
          ) : (
            (() => {
              const list = state.data
              const municipio = list[drawn ?? pickOfTheDay(list.length)]
              if (!municipio) return null
              return (
                <MunicipioCard
                  key={municipio.id}
                  municipio={municipio}
                  isDrawn={drawn !== null}
                  onDraw={() => setDrawn(Math.floor(Math.random() * list.length))}
                  onReset={() => setDrawn(null)}
                />
              )
            })()
          ))}
      </div>
    </section>
  )
}