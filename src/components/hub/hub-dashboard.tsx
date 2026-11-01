import { useCallback, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { MobileDrawer } from '@/components/layout/mobile-drawer'
import { useModuleSearch } from '@/hooks/use-module-search'
import { dataModules } from '@/lib/modules'
import { Sidebar } from './sidebar'
import { HubHeader } from './hub-header'
import { ModuleCard } from './module-card'
import { AboutSection } from './about-section'
import { useRouteEffects } from '@/hooks/use-route-effects'
import { BahiaStats } from './bahia-stats'

export function HubDashboard() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const mainRef = useRef<HTMLElement>(null)
useRouteEffects(mainRef)

  const { query, setQuery, results } = useModuleSearch()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-soft-lg focus-visible:ring-4 focus-visible:ring-slate-300"
      >
        Pular para o conteúdo
      </a>

      {/* Sidebar desktop */}
      <Sidebar
        onNavigate={closeMobile}
        className="fixed inset-y-0 left-0 z-30 hidden lg:flex"
      />

      {/* Barra superior mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <span className="font-semibold text-slate-800">Bahia Hub</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
          <Menu aria-hidden="true" />
        </Button>
      </header>

      {/* Drawer mobile */}
      <MobileDrawer open={mobileOpen} onClose={closeMobile}>
        <Sidebar onNavigate={closeMobile} className="h-full" />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Fechar menu"
          onClick={closeMobile}
          className="absolute right-3 top-4"
        >
          <X aria-hidden="true" />
        </Button>
      </MobileDrawer>

      {/* Conteúdo principal */}
      <main ref={mainRef}  id="main-content" tabIndex={-1} className="px-5 py-8 outline-none md:px-10 md:py-12 lg:ml-72">
        <ErrorBoundary resetKey={pathname}>
          {isHome ? (
            <div className="mx-auto w-full max-w-6xl">
              <HubHeader query={query} onQueryChange={setQuery} />
              <BahiaStats />

              <section aria-labelledby="modules-title" className="mt-12">
                <div className="flex items-baseline justify-between">
                  <h2 id="modules-title" className="text-lg font-semibold text-slate-800">
                    Módulos de dados
                  </h2>
                  <p className="text-sm text-slate-500" aria-live="polite">
                    {results.length} de {dataModules.length} módulos
                  </p>
                </div>

                {results.length > 0 ? (
                  <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {results.map((m) => (
                      <li key={m.id}>
                        <ModuleCard module={m} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5">
                    <EmptyState
                      title="Nenhum módulo encontrado"
                      description={`Não encontramos resultados para "${query}".`}
                      action={
                        <Button variant="outline" onClick={() => setQuery('')}>
                          Limpar busca
                        </Button>
                      }
                    />
                  </div>
                )}
              </section>

              <AboutSection />
              <footer className="mt-16 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-500">
                Bahia Hub · Dados abertos e acessíveis para todos os cidadãos
              </footer>
            </div>
          ) : (
            <Outlet />
          )}
        </ErrorBoundary>
      </main>
    </div>
  )
}