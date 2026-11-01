import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { dataModules } from '@/lib/modules'
import { useModuleSearch } from './use-module-search'

describe('useModuleSearch', () => {
  it('mostra todos os módulos sem busca', () => {
    const { result } = renderHook(() => useModuleSearch())
    expect(result.current.results).toHaveLength(dataModules.length)
  })

  it('filtra pelo texto digitado', () => {
    const { result } = renderHook(() => useModuleSearch())
    act(() => result.current.setQuery('educa'))
    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.results.length).toBeLessThan(dataModules.length)
  })

  it('trata com e sem acento do mesmo jeito', () => {
    const { result } = renderHook(() => useModuleSearch())
    act(() => result.current.setQuery('educação'))
    const withAccent = result.current.results.map((m) => m.id)
    act(() => result.current.setQuery('EDUCACAO'))
    expect(result.current.results.map((m) => m.id)).toEqual(withAccent)
  })

  it('devolve lista vazia quando nada combina', () => {
    const { result } = renderHook(() => useModuleSearch())
    act(() => result.current.setQuery('zzzzzz'))
    expect(result.current.results).toHaveLength(0)
  })
})