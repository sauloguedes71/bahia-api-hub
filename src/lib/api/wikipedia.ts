import { memoizeBy } from './cache'
import { fetchJson, isRecord } from './http'
import type { MunicipioResumo } from './types'

const API_URL = 'https://pt.wikipedia.org/w/api.php'
const SUMMARY_URL = 'https://pt.wikipedia.org/api/rest_v1/page/summary/'
const MAX_CHARS = 480

const DISAMBIGUATION = /pode (se )?referir|pode designar|pode significar/i

/** Compara títulos ignorando acentos, maiúsculas e o sufixo entre parênteses, ex.: "Santa Luzia (Bahia)". */
const normalize = (value: string): string =>
  value
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

function shorten(value: string): string {
  if (value.length <= MAX_CHARS) return value
  const cut = value.slice(0, MAX_CHARS)
  const end = cut.lastIndexOf('. ')
  return end > 200 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`
}

const pageUrl = (title: string): string => `https://pt.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

// ---------- Busca (plano A) ----------

function searchUrl(nome: string): string {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    generator: 'search',
    gsrsearch: `${nome} município Bahia`,
    gsrlimit: '5',
    prop: 'extracts|pageimages|info',
    exintro: '1',
    explaintext: '1',
    exsentences: '5',
    exlimit: 'max',
    piprop: 'thumbnail',
    pithumbsize: '960',
    inprop: 'url',
  })
  return `${API_URL}?${params.toString()}`
}

interface Candidate {
  score: number
  resumo: MunicipioResumo
}

function parseSearch(data: unknown, nome: string): MunicipioResumo | null {
  if (!isRecord(data) || !isRecord(data.query) || !Array.isArray(data.query.pages)) return null
  const wanted = normalize(nome)
  const candidates: Candidate[] = []

  data.query.pages.forEach((page: unknown) => {
    if (!isRecord(page) || typeof page.title !== 'string' || typeof page.extract !== 'string') return
    const extract = page.extract.trim()
    if (normalize(page.title) !== wanted) return
    if (!extract.includes('Bahia') || DISAMBIGUATION.test(extract)) return

    const thumb = isRecord(page.thumbnail) && typeof page.thumbnail.source === 'string' ? page.thumbnail.source : null
    candidates.push({
      // Prefere artigos que se descrevem como "município" e, depois, a ordem da busca.
      score: (extract.includes('município') ? 0 : 100) + (typeof page.index === 'number' ? page.index : 50),
      resumo: {
        texto: shorten(extract),
        imagem: thumb,
        url: typeof page.fullurl === 'string' ? page.fullurl : pageUrl(page.title),
      },
    })
  })

  candidates.sort((a, b) => a.score - b.score)
  return candidates[0]?.resumo ?? null
}

// ---------- Resumo por título (plano B) ----------

function pickImage(data: Record<string, unknown>): string | null {
  const thumb = isRecord(data.thumbnail) && typeof data.thumbnail.source === 'string' ? data.thumbnail.source : null
  const original = isRecord(data.originalimage) ? data.originalimage : null
  if (original && typeof original.source === 'string' && typeof original.width === 'number') {
    if (original.width <= 1200) return original.source
    return thumb ? thumb.replace(/\/\d+px-/, '/960px-') : null
  }
  return thumb
}

function parseSummary(data: unknown): MunicipioResumo | null {
  if (!isRecord(data) || data.type === 'disambiguation') return null
  if (typeof data.extract !== 'string' || !data.extract.includes('Bahia')) return null
  const title = typeof data.title === 'string' ? data.title : ''
  const page = isRecord(data.content_urls) && isRecord(data.content_urls.desktop) ? data.content_urls.desktop.page : null
  return {
    texto: shorten(data.extract),
    imagem: pickImage(data),
    url: typeof page === 'string' ? page : pageUrl(title),
  }
}

async function fetchSummary(title: string): Promise<MunicipioResumo | null> {
  try {
    return await fetchJson(`${SUMMARY_URL}${encodeURIComponent(title.replace(/ /g, '_'))}`, parseSummary)
  } catch {
    return null // 404 e falhas de rede viram "sem descrição"
  }
}

export const getMunicipioResumo = memoizeBy(async (nome: string): Promise<MunicipioResumo | null> => {
  try {
    const found = await fetchJson(searchUrl(nome), (data) => parseSearch(data, nome))
    if (found) return found
  } catch {
    // Se a busca falhar, tenta o plano B abaixo.
  }
  return fetchSummary(`${nome} (Bahia)`)
})