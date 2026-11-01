import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold text-sky-700">Erro 404</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-slate-900">
        Página não encontrada
      </h1>
      <p className="mt-3 text-pretty text-slate-600">
        O endereço que você tentou acessar não existe ou foi movido. Volte ao início para explorar os módulos de dados.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
      >
        Voltar ao início
      </Link>
    </div>
  )
}