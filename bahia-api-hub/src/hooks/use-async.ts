import { useCallback, useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

/** `load` precisa ser uma função estável (definida fora do componente). */
export function useAsync<T>(load: (force: boolean) => Promise<T>): { state: AsyncState<T>; reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    load(attempt > 0).then(
      (data) => active && setState({ status: 'success', data }),
      (error: unknown) =>
        active && setState({ status: 'error', error: error instanceof Error ? error : new Error('Erro desconhecido') }),
    )
    return () => {
      active = false
    }
  }, [load, attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { state, reload }
}