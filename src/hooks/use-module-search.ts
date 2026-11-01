import { useMemo, useState } from 'react'
import { normalize } from '@/lib/search'
import { dataModules, type DataModule } from '@/lib/modules'

const searchable = dataModules.map((m) => ({
  module: m,
  haystack: normalize(`${m.name} ${m.description}`),
}))

interface UseModuleSearch {
  query: string
  setQuery: (value: string) => void
  results: DataModule[]
}

export function useModuleSearch(): UseModuleSearch {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const term = normalize(query.trim())
    return term
      ? searchable.filter((s) => s.haystack.includes(term)).map((s) => s.module)
      : dataModules
  }, [query])
  return { query, setQuery, results }
}