import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dataModules, mainRepoUrl } from '@/lib/modules'
import { GithubIcon } from '@/components/hub/github-icon'
import { values } from '@/components/hub/about-section'

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header>
        <p className="text-sm font-medium text-sky-700">Bahia API Hub</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Sobre o Projeto
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
          O Bahia Hub reúne dados públicos sobre clima, economia, educação, eleições e população do
          estado em um só lugar, para que qualquer cidadão possa consultar e entender as informações da
          nossa região.
        </p>
        <a
          href={mainRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          <GithubIcon className="size-4" />
          Repositório principal
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </header>

      <section aria-labelledby="values-title" className="mt-12">
        <h2 id="values-title" className="text-lg font-semibold text-slate-800">
          Nossos princípios
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-900/[0.06]">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-800">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="team-title" className="mt-12">
        <h2 id="team-title" className="text-lg font-semibold text-slate-800">
          Módulos e responsáveis
        </h2>
        <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-900/[0.06]">
          {dataModules.map(({ id, name, description, icon: Icon, accent }) => (
            <li key={id}>
              <Link
                to={`/${id}`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-200"
              >
                <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', accent.iconBg)}>
                  <Icon className={cn('size-5', accent.iconText)} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-800">{name}</span>
                  <span className="block truncate text-sm text-slate-600">Desenvolvido por {description}</span>
                </span>
                <ArrowRight
                  className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}