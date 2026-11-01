import { useEffect, useRef, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import { moduleRoutes } from '@/lib/module-routes'

const SITE = 'Bahia Hub'

const titles: Record<string, string> = {
  '/': SITE,
  '/sobre': `Sobre o Projeto · ${SITE}`,
  ...Object.fromEntries(moduleRoutes.map((m) => [`/${m.path}`, `${m.title} · ${SITE}`])),
}

/** A cada troca de rota: atualiza o título, volta ao topo e leva o foco ao conteúdo. */
export function useRouteEffects(mainRef: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    document.title = titles[pathname] ?? `Página não encontrada · ${SITE}`

    // No primeiro carregamento não mexemos no foco, para o "Pular para o conteúdo" continuar sendo o primeiro Tab.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, mainRef])
}