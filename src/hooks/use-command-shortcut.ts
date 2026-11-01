import { useEffect } from 'react'

/** Dispara `onTrigger` com Ctrl+K (Windows/Linux) ou ⌘K (Mac). */
export function useCommandShortcut(onTrigger: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onTrigger])
}