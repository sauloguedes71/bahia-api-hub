import { Code2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mainRepoUrl, navItems } from '@/lib/modules'
import { GithubIcon } from './github-icon'

type SidebarProps = {
  activeId: string
  onNavigate: (id: string) => void
  className?: string
}

export function Sidebar({ activeId, onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-72 flex-col border-r border-slate-200/70 bg-white/80 px-5 py-6 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 text-white shadow-soft">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold tracking-tight text-slate-800">Bahia API Hub</p>
          <p className="text-xs text-slate-400">Portal de Dados Públicos</p>
        </div>
      </div>

      <nav aria-label="Navegação principal" className="mt-10 flex-1">
        <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Módulos</p>
        <ul className="mt-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-[18px] transition-colors',
                      isActive ? 'text-sky-500' : 'text-slate-400 group-hover:text-slate-600',
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Code2 className="size-4 text-slate-400" aria-hidden="true" />
            Equipe Front-End
          </div>
          <p className="mt-1.5 text-sm font-medium text-slate-700">Saulo, Solano, Pedro</p>
        </div>
        <a
          href={mainRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-soft ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
          aria-label="Repositório principal do projeto no GitHub (abre em nova aba)"
        >
          <GithubIcon className="size-[18px]" />
        </a>
      </div>
    </aside>
  )
}
