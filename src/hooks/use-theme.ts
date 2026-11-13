import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bahia-hub-theme'
const listeners = new Set<() => void>()

const read = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const notify = (): void => listeners.forEach((listener) => listener())

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function hasSavedChoice(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* armazenamento indisponível: o tema vale só nesta sessão */
  }
  notify()
}

// Sem escolha do usuário, acompanha o modo claro/escuro do sistema.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (hasSavedChoice()) return
    document.documentElement.classList.toggle('dark', event.matches)
    notify()
  })
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, read, (): Theme => 'light')
  return { theme, toggle: () => applyTheme(theme === 'dark' ? 'light' : 'dark') }
}