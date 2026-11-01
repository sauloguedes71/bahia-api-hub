export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

export type Parser<T> = (data: unknown) => T

const DEFAULT_TIMEOUT_MS = 10_000

export async function fetchJson<T>(url: string, parse: Parser<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new ApiError(`Falha na requisição (HTTP ${response.status})`, response.status)
    const data: unknown = await response.json()
    return parse(data)
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('O servidor demorou demais para responder', undefined, { cause: error })
    }
    throw new ApiError('Não foi possível conectar ao servidor', undefined, { cause: error })
  } finally {
    window.clearTimeout(timer)
  }
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null