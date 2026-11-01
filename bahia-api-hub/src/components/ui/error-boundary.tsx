import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Quando muda (ex.: pathname), o erro é limpo automaticamente. */
  resetKey?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  componentDidUpdate(prev: ErrorBoundaryProps): void {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-white p-10 text-center shadow-soft ring-1 ring-red-100">
        <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-800">Algo deu errado</h2>
        <p className="mt-1 text-sm text-slate-500">Não foi possível carregar esta seção. Tente novamente.</p>
        <Button className="mt-5" variant="outline" onClick={() => this.setState({ error: null })}>
          Tentar novamente
        </Button>
      </div>
    )
  }
}