import { ApiError, fetchJson, isRecord } from './http'
import type { BahiaTerritorio, IbgeLocalidade } from './types'

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/29' // 29 = Bahia

function parseLocalidades(data: unknown): IbgeLocalidade[] {
  if (!Array.isArray(data)) throw new ApiError('Resposta inesperada da API do IBGE')
  return data.map((item: unknown) => {
    if (!isRecord(item) || typeof item.id !== 'number' || typeof item.nome !== 'string') {
      throw new ApiError('Resposta inesperada da API do IBGE')
    }
    return { id: item.id, nome: item.nome }
  })
}

let cache: Promise<BahiaTerritorio> | null = null

/** Cache em memória: evita repetir as 3 chamadas ao navegar entre páginas. Falhas não ficam em cache. */
export function getBahiaTerritorio(force = false): Promise<BahiaTerritorio> {
  if (!cache || force) {
    const request = Promise.all([
      fetchJson(`${BASE_URL}/municipios`, parseLocalidades),
      fetchJson(`${BASE_URL}/mesorregioes`, parseLocalidades),
      fetchJson(`${BASE_URL}/microrregioes`, parseLocalidades),
    ]).then(([municipios, mesorregioes, microrregioes]) => ({
      municipios: municipios.length,
      mesorregioes: mesorregioes.length,
      microrregioes: microrregioes.length,
    }))
    request.catch(() => {
      if (cache === request) cache = null
    })
    cache = request
  }
  return cache
}