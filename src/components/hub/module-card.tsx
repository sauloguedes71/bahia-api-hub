import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DataModule } from '@/lib/modules'
import { GithubIcon } from './github-icon'

interface ModuleCardProps {
  module: DataModule
}

export const ModuleCard = memo(function ModuleCard({ module }: ModuleCardProps) {
  const { icon: Icon, accent, id, name, description, repoUrl } = module

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-900/[0.06]',
        'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-within:ring-2 focus-within:ring-sky-300',
        accent.ring,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('absolute inset-x-0 top-0 h-1 opacity-60 transition-opacity duration-300 group-hover:opacity-100', accent.bar)}
      />

      <div className={cn('flex size-14 items-center justify-center rounded-2xl ring-1 ring-inset ring-black/5 transition-transform duration-300 group-hover:scale-105', accent.iconBg)}>
        <Icon className={cn('size-7', accent.iconText)} aria-hidden="true" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">
        {/* Stretched link: o ::after cobre o card inteiro */}
        <Link
          to={`/${id}`}
          className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
        >
          {name}
          <span className="sr-only">: explorar dados</span>
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-slate-600">{description}</p>

      <span className={cn('mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium', accent.link)} aria-hidden="true">
        Explorar dados
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
      </span>

      <footer className="relative z-10 mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
  <a
    href={repoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
  >
    <GithubIcon className="size-3.5" />
    Ver código
    <span className="sr-only"> do módulo {name} no GitHub (abre em nova aba)</span>
  </a>
</footer>
    </article>
  )
})
