import { useCallback, useId, type ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAsync } from '@/hooks/use-async'
import { getBahiaContorno, getMunicipioContorno } from '@/lib/api/ibge'
import type { Ponto, Ring } from '@/lib/api/types'

interface Frame {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

type Project = (point: Ponto) => Ponto

function boundsOf(rings: readonly Ring[]): Frame {
  const frame: Frame = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity }
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      frame.minLon = Math.min(frame.minLon, lon)
      frame.maxLon = Math.max(frame.maxLon, lon)
      frame.minLat = Math.min(frame.minLat, lat)
      frame.maxLat = Math.max(frame.maxLat, lat)
    }
  }
  return frame
}

/** Projeção simples (longitude corrigida pelo cosseno da latitude) ajustada a um quadro 100×100. */
function makeProjection(frame: Frame, size = 100, pad = 8): Project {
  const k = Math.cos((((frame.minLat + frame.maxLat) / 2) * Math.PI) / 180)
  const width = (frame.maxLon - frame.minLon) * k
  const height = frame.maxLat - frame.minLat
  const scale = (size - pad * 2) / Math.max(width, height)
  const offsetX = (size - width * scale) / 2
  const offsetY = (size - height * scale) / 2
  return ([lon, lat]) => [offsetX + (lon - frame.minLon) * k * scale, offsetY + (frame.maxLat - lat) * scale]
}

/** Gera o `d` do <path>, reduzindo a quantidade de pontos para manter o SVG leve. */
function toPath(rings: readonly Ring[], project: Project): string {
  return rings
    .map((ring) => {
      const step = Math.max(1, Math.floor(ring.length / 300))
      const points = ring
        .filter((_, index) => index % step === 0 || index === ring.length - 1)
        .map((point) => project(point))
      return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`
    })
    .join('')
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-900/[0.06]">
        {children}
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">{label}</figcaption>
    </figure>
  )
}

function Unavailable() {
  return (
    <div className="flex size-full items-center justify-center">
      <MapPin className="size-8 text-slate-300" aria-label="Mapa indisponível" />
    </div>
  )
}

export function MunicipioMapas({ id, nome }: { id: number; nome: string }) {
  const gradientId = useId()
  const estado = useAsync(getBahiaContorno).state
  const loadMunicipio = useCallback(() => getMunicipioContorno(id), [id])
  const municipio = useAsync(loadMunicipio).state

  const contour =
    municipio.status === 'loading' ? (
      <Skeleton className="size-full rounded-none" />
    ) : municipio.status === 'error' ? (
      <Unavailable />
    ) : (
      (() => {
        const project = makeProjection(boundsOf(municipio.data.rings))
        return (
          <svg viewBox="0 0 100 100" role="img" aria-label={`Contorno do município de ${nome}`} className="size-full">
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#38bdf8" />
                <stop offset="1" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <path
              d={toPath(municipio.data.rings, project)}
              fill={`url(#${gradientId}-fill)`}
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeLinejoin="round"
              fillRule="evenodd"
            />
          </svg>
        )
      })()
    )

  const location =
    estado.status === 'loading' || municipio.status === 'loading' ? (
      <Skeleton className="size-full rounded-none" />
    ) : estado.status === 'error' || municipio.status === 'error' ? (
      <Unavailable />
    ) : (
      (() => {
        const project = makeProjection(boundsOf(estado.data.rings))
        const frame = boundsOf(municipio.data.rings)
        const [cx, cy] = project([(frame.minLon + frame.maxLon) / 2, (frame.minLat + frame.maxLat) / 2])
        return (
          <svg viewBox="0 0 100 100" role="img" aria-label={`Localização de ${nome} no mapa da Bahia`} className="size-full">
            <path
              d={toPath(estado.data.rings, project)}
              className="fill-slate-200 stroke-slate-300"
              strokeWidth="0.4"
              strokeLinejoin="round"
              fillRule="evenodd"
            />
            <path
              d={toPath(municipio.data.rings, project)}
              className="fill-amber-400 stroke-amber-600"
              strokeWidth="0.4"
              fillRule="evenodd"
            />
            <circle
              cx={cx}
              cy={cy}
              r="3.2"
              className="origin-center animate-ping fill-amber-400 opacity-60 [transform-box:fill-box] motion-reduce:animate-none"
            />
            <circle cx={cx} cy={cy} r="1.8" className="fill-amber-500 stroke-white" strokeWidth="0.7" />
          </svg>
        )
      })()
    )

  return (
    <div className="grid grid-cols-2 gap-3 lg:w-[22rem]">
      <Tile label="Localização na Bahia">{location}</Tile>
      <Tile label="Contorno do município">{contour}</Tile>
    </div>
  )
}