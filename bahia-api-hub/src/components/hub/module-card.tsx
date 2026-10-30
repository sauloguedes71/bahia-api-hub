import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DataModule } from '@/lib/modules'
import { GithubIcon } from './github-icon'

export function ModuleCard({ module }: { module: DataModule }) {
  const Icon = module.icon
  const { accent } = module

  return (
    <article
      id={module.id}
      className={cn(
        'group relative flex h-full scroll-mt-8 flex-col overflow-hidden rounded-xl bg-white p-6 shadow-soft ring-1 ring-slate-900/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg',
        accent.ring,
      )}
    >
      <span
        className={cn(
          'absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100',
          accent.bar,
        )}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between">
        <div className={cn('flex size-14 items-center justify-center rounded-full', accent.iconBg)}>
          <Icon className={cn('size-7', accent.iconText)} aria-hidden="true" />
        </div>
        <ArrowRight
          className="size-5 -translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-800">
        <a href={`#${module.id}`} className="rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200">
          {module.name}
        </a>
      </h3>
      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-slate-500">{module.description}</p>

      <a href={`#${module.id}`} className={cn('mt-5 w-fit text-sm font-medium hover:underline', accent.link)}>
        Explorar dados<span className="sr-only"> de {module.name}</span>
      </a>

      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="min-w-0 truncate text-xs text-slate-400">
          Desenvolvido por: <span className="font-medium text-slate-500">{module.developers}</span>
        </p>
        <a
          href={module.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
        >
          <GithubIcon className="size-3.5" />
          Ver código
          <span className="sr-only"> do módulo {module.name} no GitHub (abre em nova aba)</span>
        </a>
      </footer>
    </article>
  )
}
