export interface ModuleRoute {
  path: string
  title: string
  url?: string
}

export const moduleRoutes: readonly ModuleRoute[] = [
  { path: 'eleicoes', title: 'Módulo Eleições', url: 'https://elei-es-bahia.vercel.app/' },
  { path: 'clima', title: 'Módulo Clima' },
  { path: 'economia', title: 'Módulo Economia' },
  { path: 'educacao', title: 'Módulo Educação' },
  { path: 'populacao', title: 'Módulo População' },
]