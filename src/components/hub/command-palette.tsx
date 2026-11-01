import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Moon, Search, Sun, type LucideIcon } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { dataModules, navItems } from '@/lib/modules'
import { normalize } from '@/lib/search'
import { cn } from '@/lib/utils'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent)
const shortcut = isMac ? '⌘ K' : 'Ctrl K'

const hints: Record<string, string> = {
  hub: 'Página inicial',
  sobre: 'Sobre o projeto e seus princípios',
}
const descriptions = new Map(dataModules.map((m) => [m.id, m.description]))
const toPath = (id: string): string => (id === 'hub' ? '/' : `/${id}`)

const pages = navItems.map(({ id, label, icon }) => {
  const hint = descriptions.get(id) ?? hints[id] ?? ''
  return { id, label, hint, icon, to: toPath(id), haystack: normalize(`${label} ${hint}`) }
})

interface PaletteItem {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  haystack: string
  run: () => void
}

interface SearchTriggerProps {
  onClick: () => void
  className?: string
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar páginas e módulos"
      aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
      className={cn(
        'flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm transition-colors',
        'hover:border-slate-300 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200',
        className,
      )}
    >
      <Search className="size-4" aria-hidden="true" />
      <span className="flex-1 text-left">Buscar…</span>
      <kbd className="rounded-md bg-slate-100 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500">{shortcut}</kbd>
    </button>
  )
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const items: PaletteItem[] = [
    ...pages.map((page) => ({ ...page, run: () => navigate(page.to) })),
    {
      id: 'theme',
      label: theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro',
      hint: 'Alternar a aparência do portal',
      icon: theme === 'dark' ? Sun : Moon,
      haystack: normalize('tema escuro claro aparencia modo'),
      run: toggle,
    },
  ]

  const words = normalize(query).split(/\s+/).filter(Boolean)
  const results = items.filter((item) => words.every((word) => item.haystack.includes(word)))
  const current = results.length > 0 ? Math.min(active, results.length - 1) : -1

  useEffect(() => {
    if (open && current >= 0) document.getElementById(`${listId}-${current}`)?.scrollIntoView({ block: 'nearest' })
  }, [current, open, listId])

  const handleClose = (): void => {
    setQuery('')
    setActive(0)
    onClose()
  }

  const choose = (item: PaletteItem): void => {
    handleClose()
    item.run()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[current]
      if (item) choose(item)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Busca rápida"
      onClose={handleClose}
      onClick={(event) => event.target === event.currentTarget && handleClose()}
      className="mx-auto mb-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border-0 bg-white p-0 text-slate-800 shadow-soft-lg ring-1 ring-slate-900/[0.08] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4">
        <Search className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={results.length > 0 ? listId : undefined}
          aria-activedescendant={current >= 0 ? `${listId}-${current}` : undefined}
          aria-label="Buscar páginas e módulos"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Buscar páginas, módulos e ações…"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-500"
        />
        <kbd className="hidden shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500 sm:block">Esc</kbd>
      </div>

      <p role="status" className="sr-only">
        {results.length === 0 ? 'Nenhum resultado' : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
      </p>

      {results.length > 0 ? (
        <ul id={listId} role="listbox" aria-label="Resultados" className="max-h-80 overflow-y-auto p-2">
          {results.map((item, index) => {
            const Icon = item.icon
            const isActive = index === current
            return (
              <li
                key={item.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isActive}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(item)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  isActive ? 'bg-sky-50 ring-1 ring-sky-100' : 'ring-1 ring-transparent',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    isActive ? 'bg-white text-sky-600 shadow-sm' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                  {item.hint && <span className="block truncate text-xs text-slate-500">{item.hint}</span>}
                </span>
                {isActive && <CornerDownLeft className="size-4 shrink-0 text-slate-400" aria-hidden="true" />}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-slate-500">Nada encontrado para “{query}”.</p>
      )}

      <div className="hidden items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 sm:flex" aria-hidden="true">
        <span>↑ ↓ navegar</span>
        <span>↵ abrir</span>
        <span>esc fechar</span>
      </div>
    </dialog>
  )
}