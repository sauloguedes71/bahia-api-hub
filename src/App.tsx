import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HubDashboard } from '@/components/hub/hub-dashboard'
import { ModuleFrame } from '@/components/hub/module-frame'
import { AboutPage } from '@/pages/about-page'
import { moduleRoutes } from '@/lib/module-routes'
import { NotFoundPage } from '@/pages/not-found-page'

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