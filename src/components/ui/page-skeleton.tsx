import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <div role="status" aria-label="Carregando página" className="mx-auto w-full max-w-4xl">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-9 w-2/3" />
      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-4/5 max-w-xl" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </div>
  )
}