import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { mainRepoUrl } from '@/lib/modules'
import { GithubIcon } from './github-icon'

export const values = [
  {
    icon: Sparkles,
    title: 'Simples para todos',
    text: 'Dados apresentados de forma clara, sem jargões técnicos.',
  },
  {
    icon: ShieldCheck,
    title: 'Aberto e transparente',
    text: 'Acesso livre, sem cadastro, com código-fonte público.',
  },
  {
    icon: HeartHandshake,
    title: 'Feito em equipe',
    text: 'Cada módulo é desenvolvido por um grupo dedicado de estudantes.',
  },
]

export function AboutSection() {
  return (
    <section
      id="sobre"
      aria-labelledby="about-heading"
      className="mt-14 scroll-mt-8 rounded-xl bg-white p-6 shadow-soft ring-1 ring-slate-900/[0.04] md:p-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h2 id="about-heading" className="text-lg font-semibold text-slate-800">
            Sobre o Projeto
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-500">
            O Bahia Hub reúne dados públicos sobre clima, economia, educação, eleições e população do estado
            em um só lugar, para que qualquer cidadão possa consultar e entender as informações da nossa região.
          </p>
        </div>
        <a
          href={mainRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
        >
          <GithubIcon className="size-4" />
          Repositório principal
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-lg bg-slate-50 p-4">
            <Icon className="size-5 text-sky-500" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
