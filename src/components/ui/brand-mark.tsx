import { useId } from 'react'
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
}

/** Marca do Bahia Hub: o sol da Bahia no centro de uma rede de dados. */
export function BrandMark({ className }: BrandMarkProps) {
  const id = useId()
  const bg = `${id}-bg`
  const sun = `${id}-sun`

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn('shrink-0', className)}>
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id={sun} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${bg})`} />
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d="M32 18V13.5M46 32H50.5M32 46V50.5M18 32H13.5" />
        <path d="M41.9 22.1L46 18M41.9 41.9L46 46M22.1 41.9L18 46M22.1 22.1L18 18" />
      </g>
      <g fill="#fff">
        <circle cx="32" cy="9" r="4.5" />
        <circle cx="55" cy="32" r="4.5" />
        <circle cx="32" cy="55" r="4.5" />
        <circle cx="9" cy="32" r="4.5" />
      </g>
      <g fill="#fff" opacity="0.85">
        <circle cx="48.26" cy="15.74" r="3.2" />
        <circle cx="48.26" cy="48.26" r="3.2" />
        <circle cx="15.74" cy="48.26" r="3.2" />
        <circle cx="15.74" cy="15.74" r="3.2" />
      </g>
      <circle cx="32" cy="32" r="11" fill={`url(#${sun})`} />
    </svg>
  )
}
