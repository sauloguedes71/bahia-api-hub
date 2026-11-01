import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './error-boundary'

function Bomb(): ReactNode {
  throw new Error('boom')
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renderiza os filhos quando não há erro', () => {
    render(
      <ErrorBoundary>
        <p>conteúdo</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('mostra o aviso quando um filho quebra', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado')
  })

  it('limpa o erro quando a chave de reset muda (troca de rota)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <ErrorBoundary resetKey="a">
        <Bomb />
      </ErrorBoundary>,
    )
    rerender(
      <ErrorBoundary resetKey="b">
        <p>página nova</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('página nova')).toBeInTheDocument()
  })
})