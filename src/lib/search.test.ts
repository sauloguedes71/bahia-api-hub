import { describe, expect, it } from 'vitest'
import { normalize } from './search'

describe('normalize', () => {
  it('remove acentos e ignora maiúsculas', () => {
    expect(normalize('Educação')).toBe('educacao')
    expect(normalize('ELEIÇÕES')).toBe('eleicoes')
  })

  it('mantém textos sem acento', () => {
    expect(normalize('clima')).toBe('clima')
  })
})