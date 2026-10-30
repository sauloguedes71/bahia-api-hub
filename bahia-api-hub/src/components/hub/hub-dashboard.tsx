'use client'

import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react'
import { Menu, Sparkles, X } from 'lucide-react'
import { dataModules } from '@/lib/modules'
import { Sidebar } from './sidebar'
import { HubHeader } from './hub-header'
import { ModuleCard } from './module-card'
import { AboutSection } from './about-section'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function HubDashboard() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState('hub')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Mantém o item do menu lateral selecionado corretamente ao atualizar a página
  useEffect(() => {
    const path = location.pathname.substring(1)
    setActiveId(path === '' ? 'hub' : path)
  }, [location.pathname])

  const search = normalize(query.trim())
  const visibleModules = search
    ? dataModules.filter((m) => normalize(`${m.name} ${m.description}`).includes(search))
    : dataModules

  const handleNavigate = (id: string) => {
    setActiveId(id)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar activeId={activeId} onNavigate={handleNavigate} className="fixed inset-y-0 left-0 z-30 hidden lg:flex" />

      {/* Menu Mobile */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <span className="font-semibold text-slate-800">Bahia API Hub</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 animate-in slide-in-from-left duration-200">
            <Sidebar activeId={activeId} onNavigate={handleNavigate} className="bg-white" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Área Central Dinâmica */}
      <main id="hub" className="px-5 py-8 md:px-10 md:py-12 lg:ml-72 flex flex-col h-screen">
        {isHome ? (
          <div className="mx-auto w-full max-w-6xl">
            <HubHeader query={query} onQueryChange={setQuery} />

            <section className="mt-12">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Módulos de dados</h2>
                <p className="text-sm text-slate-400">
                  {visibleModules.length} de {dataModules.length} módulos
                </p>
              </div>

              {visibleModules.length > 0 ? (
                <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleModules.map((module) => (
                    <li key={module.id}>
                      <ModuleCard module={module} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-xl bg-white p-10 text-center shadow-soft">
                  <p className="font-medium text-slate-700">Nenhum módulo encontrado</p>
                </div>
              )}
            </section>

            <AboutSection />
            <footer className="mt-16 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-400">
              Bahia API Hub · Dados abertos e acessíveis para todos os cidadãos
            </footer>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}