import {
  CloudSun,
  GraduationCap,
  Info,
  Landmark,
  LayoutGrid,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type DataModule = {
  id: string
  name: string
  description: string
  repoUrl: string
  icon: LucideIcon
  accent: {
    iconBg: string
    iconText: string
    ring: string
    bar: string
    link: string
  }
}

export const navItems: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'hub', label: 'Início (Hub)', icon: LayoutGrid },
  { id: 'clima', label: 'Clima', icon: CloudSun },
  { id: 'economia', label: 'Economia', icon: TrendingUp },
  { id: 'educacao', label: 'Educação', icon: GraduationCap },
  { id: 'eleicoes', label: 'Eleições', icon: Landmark },
  { id: 'populacao', label: 'População', icon: Users },
  { id: 'sobre', label: 'Sobre o Projeto', icon: Info },
]

export const mainRepoUrl = 'https://github.com/bahia-api-hub/bahia-api-hub'

export const dataModules: DataModule[] = [
  {
    id: 'clima',
    repoUrl: 'https://github.com/bahia-api-hub/modulo-clima',
    name: 'Clima',
    description:
      'Consulte dados meteorológicos, temperaturas, chuvas e previsões para os municípios baianos.',
    icon: CloudSun,
    accent: {
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-500',
      ring: 'group-hover:ring-amber-100',
      bar: 'bg-amber-400',
      link: 'text-amber-600',
    },
  },
  {
    id: 'economia',
    repoUrl: 'https://github.com/bahia-api-hub/modulo-economia',
    name: 'Economia',
    description:
      'Acompanhe indicadores econômicos, PIB, emprego e renda da nossa região de forma simples.',
    icon: TrendingUp,
    accent: {
      iconBg: 'bg-sky-50',
      iconText: 'text-sky-500',
      ring: 'group-hover:ring-sky-100',
      bar: 'bg-sky-400',
      link: 'text-sky-600',
    },
  },
  {
    id: 'educacao',
    repoUrl: 'https://github.com/bahia-api-hub/modulo-educacao',
    name: 'Educação',
    description:
      'Explore números sobre escolas, matrículas e desempenho educacional em toda a Bahia.',
    icon: GraduationCap,
    accent: {
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-500',
      ring: 'group-hover:ring-indigo-100',
      bar: 'bg-indigo-400',
      link: 'text-indigo-600',
    },
  },
  {
    id: 'eleicoes',
    repoUrl: 'https://github.com/bahia-api-hub/modulo-eleicoes',
    name: 'Eleições',
    description:
      'Veja resultados eleitorais, perfil do eleitorado e a participação cidadã por município.',
    icon: Landmark,
    accent: {
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-500',
      ring: 'group-hover:ring-violet-100',
      bar: 'bg-violet-400',
      link: 'text-violet-600',
    },
  },
  {
    id: 'populacao',
    repoUrl: 'https://github.com/bahia-api-hub/modulo-populacao',
    name: 'População',
    description:
      'Descubra dados demográficos, crescimento populacional e características dos habitantes.',
    icon: Users,
    accent: {
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-500',
      ring: 'group-hover:ring-emerald-100',
      bar: 'bg-emerald-400',
      link: 'text-emerald-600',
    },
  },
]
