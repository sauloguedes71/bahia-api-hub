import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from './use-theme'

beforeEach(() => {
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

describe('useTheme', () => {
  it('começa claro quando não há classe dark', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('alterna para escuro, aplica a classe e salva a escolha', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('bahia-hub-theme')).toBe('dark')
  })

  it('volta para claro no segundo clique', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('mantém duas instâncias sincronizadas (sidebar + drawer)', () => {
    const first = renderHook(() => useTheme())
    const second = renderHook(() => useTheme())
    act(() => first.result.current.toggle())
    expect(second.result.current.theme).toBe('dark')
  })
})