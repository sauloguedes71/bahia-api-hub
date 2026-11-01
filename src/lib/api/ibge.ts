import { memoize, memoizeBy } from './cache'
import { ApiError, fetchJson, isRecord } from './http'
import type { BahiaTerritorio, Contorno, IbgeLocalidade, Municipio, MunicipioStats, Ring } from './types'

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/29' // 29 = Bahia
const MALHAS_URL = 'https://servicodados.ibge.gov.br/api/v3/malhas'
const GEOJSON = `formato=${encodeURIComponent('application/vnd.geo+json')}`
// Tabela 4714 (Censo 2022): 93 = população, 6318 = área (km²), 614 = densidade
const AGREGADO_URL = 'https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614'

const text = (value: unknown): string => (typeof value === 'string' ? value : '')
const unexpected = (): ApiError => new ApiError('Resposta inesperada da API do IBGE')

function parseLocalidades(data: unknown): IbgeLocalidade[] {
  if (!Array.isArray(data)) throw unexpected()
  return data.map((item: unknown) => {
    if (!isRecord(item) || typeof item.id !== 'number' || typeof item.nome !== 'string') throw unexpected()
    return { id: item.id, nome: item.nome }
  })
}

function parseMunicipios(data: unknown): Municipio[] {
  if (!Array.isArray(data)) throw unexpected()
  return data.map((item: unknown) => {
    if (!isRecord(item) || typeof item.id !== 'number' || typeof item.nome !== 'string') throw unexpected()
    const micro = isRecord(item.microrregiao) ? item.microrregiao : null
    const meso = micro && isRecord(micro.mesorregiao) ? micro.mesorregiao : null
    return { id: item.id, nome: item.nome, microrregiao: text(micro?.nome), mesorregiao: text(meso?.nome) }
  })
}

function readValue(variable: Record<string, unknown>): number | null {
  if (!Array.isArray(variable.resultados)) return null
  const result: unknown = variable.resultados[0]
  if (!isRecord(result) || !Array.isArray(result.series)) return null
  const series: unknown = result.series[0]
  if (!isRecord(series) || !isRecord(series.serie)) return null
  const raw = series.serie['2022']
  const value = typeof raw === 'string' ? Number(raw.replace(',', '.')) : NaN
  return Number.isFinite(value) ? value : null
}

function parseStats(data: unknown): MunicipioStats {
  if (!Array.isArray(data)) throw unexpected()
  const stats: MunicipioStats = { populacao: null, areaKm2: null, densidade: null }
  data.forEach((variable: unknown) => {
    if (!isRecord(variable)) return
    const value = readValue(variable)
    if (variable.id === '93') stats.populacao = value
    else if (variable.id === '6318') stats.areaKm2 = value
    else if (variable.id === '614') stats.densidade = value
  })
  return stats
}

function readRing(value: unknown): Ring {
  const ring: Ring = []
  if (!Array.isArray(value)) return ring
  value.forEach((point: unknown) => {
    if (Array.isArray(point) && typeof point[0] === 'number' && typeof point[1] === 'number') {
      ring.push([point[0], point[1]])
    }
  })
  return ring
}

function collectPolygon(polygon: unknown, rings: Ring[]): void {
  if (!Array.isArray(polygon)) return
  polygon.forEach((raw: unknown) => {
    const ring = readRing(raw)
    if (ring.length > 2) rings.push(ring)
  })
}

function collectGeometry(geometry: unknown, rings: Ring[]): void {
  if (!isRecord(geometry)) return
  if (geometry.type === 'Polygon') collectPolygon(geometry.coordinates, rings)
  else if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
    geometry.coordinates.forEach((polygon: unknown) => collectPolygon(polygon, rings))
  }
}

function parseContorno(data: unknown): Contorno {
  const rings: Ring[] = []
  if (isRecord(data)) {
    if (Array.isArray(data.features)) {
      data.features.forEach((feature: unknown) => {
        if (isRecord(feature)) collectGeometry(feature.geometry, rings)
      })
    } else if (isRecord(data.geometry)) collectGeometry(data.geometry, rings)
    else collectGeometry(data, rings)
  }
  if (rings.length === 0) throw unexpected()
  return { rings }
}

export const getMunicipiosBahia = memoize(() => fetchJson(`${BASE_URL}/municipios`, parseMunicipios))

export const getBahiaTerritorio = memoize(async (): Promise<BahiaTerritorio> => {
  const [municipios, mesorregioes, microrregioes] = await Promise.all([
    getMunicipiosBahia(),
    fetchJson(`${BASE_URL}/mesorregioes`, parseLocalidades),
    fetchJson(`${BASE_URL}/microrregioes`, parseLocalidades),
  ])
  return { municipios: municipios.length, mesorregioes: mesorregioes.length, microrregioes: microrregioes.length }
})

export const getMunicipioStats = memoizeBy((id: number) =>
  fetchJson(`${AGREGADO_URL}?localidades=N6%5B${id}%5D`, parseStats),
)

export const getMunicipioContorno = memoizeBy((id: number) =>
  fetchJson(`${MALHAS_URL}/municipios/${id}?${GEOJSON}`, parseContorno),
)

export const getBahiaContorno = memoize(() =>
  fetchJson(`${MALHAS_URL}/estados/29?${GEOJSON}`, parseContorno, 25_000),
)