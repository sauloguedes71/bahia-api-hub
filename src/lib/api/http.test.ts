import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchJson, isRecord } from './http'

const parseName = (data: unknown): string => {
  if (!isRecord(data) || typeof data.nome !== 'string') throw new ApiError('Resposta inesperada')
  return data.nome
}

const respond = (body: unknown, init?: ResponseInit): Response => new Response(JSON.stringify(body), init)

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchJson', () => {
  it('devolve os dados validados pelo parser', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({ nome: 'Salvador' })))
    await expect(fetchJson('https://exemplo.test', parseName)).resolves.toBe('Salvador')
  })

  it('lança ApiError com o status quando a resposta não é ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({}, { status: 500 })))
    await expect(fetchJson('https://exemplo.test', parseName)).rejects.toMatchObject({ name: 'ApiError', status: 500 })
  })

  it('lança ApiError quando o servidor não responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(fetchJson('https://exemplo.test', parseName)).rejects.toThrow('Não foi possível conectar')
  })

  it('repassa o erro do parser quando o formato é inesperado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({ outro: 1 })))
    await expect(fetchJson('https://exemplo.test', parseName)).rejects.toThrow('Resposta inesperada')
  })
})

describe('isRecord', () => {
  it('aceita objetos e rejeita null e primitivos', () => {
    expect(isRecord({})).toBe(true)
    expect(isRecord(null)).toBe(false)
    expect(isRecord('texto')).toBe(false)
  })
})