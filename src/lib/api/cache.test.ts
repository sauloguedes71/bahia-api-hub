import { describe, expect, it, vi } from 'vitest'
import { memoize, memoizeBy } from './cache'

describe('memoize', () => {
  it('executa a chamada uma única vez', async () => {
    const load = vi.fn().mockResolvedValue('dados')
    const get = memoize(load)
    await get()
    await get()
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('refaz a chamada com force', async () => {
    const load = vi.fn().mockResolvedValue('dados')
    const get = memoize(load)
    await get()
    await get(true)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('não guarda falhas em cache', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('falhou')).mockResolvedValueOnce('ok')
    const get = memoize(load)
    await expect(get()).rejects.toThrow('falhou')
    await expect(get()).resolves.toBe('ok')
    expect(load).toHaveBeenCalledTimes(2)
  })
})

describe('memoizeBy', () => {
  it('guarda uma chamada por chave', async () => {
    const load = vi.fn((id: number) => Promise.resolve(`município ${id}`))
    const get = memoizeBy(load)
    await get(1)
    await get(1)
    await get(2)
    expect(load).toHaveBeenCalledTimes(2)
  })
})