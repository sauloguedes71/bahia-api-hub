export interface ModuleRoute {
  path: string
  title: string
  url?: string
}

export const moduleRoutes: readonly ModuleRoute[] = [
  { path: 'eleicoes', title: 'Módulo Eleições', url: 'https://elei-es-bahia-wh.vercel.app/' },
  { path: 'clima', title: 'Módulo Clima' },
  { path: 'economia', title: 'Módulo Economia', url: 'https://eco-dashboard.1012413467.workers.dev/' },
  { path: 'educacao', title: 'Módulo Educação' },
  { path: 'populacao', title: 'Módulo População' },
]