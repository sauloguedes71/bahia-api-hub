import { useState } from 'react'
import { Hammer } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ModuleFrameProps {
  title: string
  url?: string
}

export function ModuleFrame({ title, url }: ModuleFrameProps) {
  const [loaded, setLoaded] = useState(false)

  if (!url) {
    return (
      <div
        role="status"
        className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center"
      >
        <Hammer className="size-8 text-slate-300" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-medium text-slate-700">{title} em desenvolvimento</h1>
        <p className="mt-1 text-sm text-slate-500">Aguardando o link de produção da equipe responsável.</p>
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100dvh-6rem)] w-full" aria-busy={!loaded}>
      <h1 className="sr-only">{title}</h1>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />}
      <iframe
        src={url}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full rounded-xl border-0 bg-white shadow-soft transition-opacity duration-300 data-[loaded=false]:opacity-0"
        data-loaded={loaded}
      />
    </div>
  )
}