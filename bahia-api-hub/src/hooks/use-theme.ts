import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bahia-hub-theme'
const listeners = new Set<() => void>()

const read = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* armazenamento indisponível: o tema vale só nesta sessão */
  }
  listeners.forEach((listener) => listener())
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, read, (): Theme => 'light')
  return { theme, toggle: () => applyTheme(theme === 'dark' ? 'light' : 'dark') }
}