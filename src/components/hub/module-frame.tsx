import { useCallback, useEffect, useRef, useState } from 'react'
import { Hammer } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme, type Theme } from '@/hooks/use-theme'

interface ModuleFrameProps {
  title: string
  url?: string
}

const originOf = (url: string): string | null => {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

// Apps em React registram o "ouvinte" depois do evento load, então reenviamos o tema logo em seguida.
const RESEND_DELAYS_MS = [400, 1500] as const

export function ModuleFrame({ title, url }: ModuleFrameProps) {
  const { theme } = useTheme()
  const [loaded, setLoaded] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const themeRef = useRef<Theme>(theme)
  const timers = useRef<number[]>([])
  const origin = url ? originOf(url) : null

  const sendTheme = useCallback(
    (value: Theme) => {
      if (!origin) return
      // O destino é restrito à origem do módulo: nenhum outro site recebe a mensagem.
      frameRef.current?.contentWindow?.postMessage({ type: 'bahia-hub:theme', theme: value }, origin)
    },
    [origin],
  )

  // Sempre que o usuário troca o tema, avisa o módulo.
  useEffect(() => {
    themeRef.current = theme
    if (loaded) sendTheme(theme)
  }, [theme, loaded, sendTheme])

  // Limpa os reenvios pendentes ao sair da página.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const handleLoad = (): void => {
    setLoaded(true)
    sendTheme(themeRef.current)
    timers.current = RESEND_DELAYS_MS.map((delay) => window.setTimeout(() => sendTheme(themeRef.current), delay))
  }

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
        ref={frameRef}
        src={url}
        title={title}
        loading="lazy"
        onLoad={handleLoad}
        className="h-full w-full rounded-xl border-0 bg-white shadow-soft transition-opacity duration-300 data-[loaded=false]:opacity-0"
        data-loaded={loaded}
      />
    </div>
  )
}