import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HubDashboard } from '@/components/hub/hub-dashboard'
import { moduleRoutes } from '@/lib/module-routes'

const ModuleFrame = lazy(() => import('@/components/hub/module-frame').then((m) => ({ default: m.ModuleFrame })))
const AboutPage = lazy(() => import('@/pages/about-page').then((m) => ({ default: m.AboutPage })))
const NotFoundPage = lazy(() => import('@/pages/not-found-page').then((m) => ({ default: m.NotFoundPage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HubDashboard />}>
          <Route path="sobre" element={<AboutPage />} />
          {moduleRoutes.map((m) => (
            <Route key={m.path} path={m.path} element={<ModuleFrame title={m.title} url={m.url} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}