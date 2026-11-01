import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsync } from './use-async'

describe('useAsync', () => {
  it('passa de loading para success', async () => {
    const load = vi.fn<(force: boolean) => Promise<string>>().mockResolvedValue('ok')
    const { result } = renderHook(() => useAsync(load))
    expect(result.current.state.status).toBe('loading')
    await waitFor(() => expect(result.current.state).toEqual({ status: 'success', data: 'ok' }))
  })

  it('vai para error quando a chamada falha', async () => {
    const load = vi.fn<(force: boolean) => Promise<string>>().mockRejectedValue(new Error('falhou'))
    const { result } = renderHook(() => useAsync(load))
    await waitFor(() => expect(result.current.state.status).toBe('error'))
    expect(result.current.state).toMatchObject({ error: { message: 'falhou' } })
  })

  it('reload volta a carregar e pede dados novos (force = true)', async () => {
    const load = vi.fn<(force: boolean) => Promise<string>>().mockResolvedValue('ok')
    const { result } = renderHook(() => useAsync(load))
    await waitFor(() => expect(result.current.state.status).toBe('success'))

    act(() => result.current.reload())
    expect(result.current.state.status).toBe('loading')
    await waitFor(() => expect(result.current.state.status).toBe('success'))
    expect(load).toHaveBeenLastCalledWith(true)
  })
})