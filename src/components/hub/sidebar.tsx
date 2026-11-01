import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BrandMark } from '@/components/ui/brand-mark'
import { mainRepoUrl, navItems } from '@/lib/modules'
import { GithubIcon } from './github-icon'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SearchTrigger } from './command-palette'

interface SidebarProps {
  onNavigate?: () => void
   onSearch?: () => void
  className?: string
}

const team = ['Saulo', 'Solano', 'Pedro'] as const
const toPath = (id: string): string => (id === 'hub' ? '/' : `/${id}`)

export function Sidebar({ onNavigate, onSearch, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-72 flex-col border-r border-slate-200/70 bg-gradient-to-b from-white to-slate-50/80 px-4 py-6 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-3 px-2">
        <BrandMark className="size-11 drop-shadow-sm" />
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-tight text-slate-900">Bahia Hub</p>
          <p className="text-xs text-slate-500">Portal de Dados Públicos</p>
        </div>
      </div>

      {onSearch && <SearchTrigger onClick={onSearch} className="mt-6" />}

      <nav aria-label="Navegação principal" className="mt-6 flex-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Módulos</p>
        <ul className="mt-3 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <NavLink
                to={toPath(id)}
                end={id === 'hub'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200',
                    isActive
                      ? 'bg-sky-50 text-sky-900 shadow-sm ring-1 ring-sky-100 before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full before:bg-sky-500'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex size-8 items-center justify-center rounded-lg transition-colors',
                        isActive ? 'bg-white text-sky-600 shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700',
                      )}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-900/[0.06]">
        <p className="text-xs font-medium text-slate-500">Equipe Front-End</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <ul className="flex -space-x-2" aria-label={team.join(', ')}>
            {team.map((name) => (
              <li
                key={name}
                title={name}
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-semibold text-slate-700 ring-2 ring-white"
              >
                {name[0]}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
  <ThemeToggle />
  <a
    href={mainRepoUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Repositório principal do projeto no GitHub (abre em nova aba)"
    className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 motion-reduce:hover:translate-y-0"
  >
    <GithubIcon className="size-[18px]" />
  </a>
</div>
        </div>
      </div>
    </aside>
  )
}