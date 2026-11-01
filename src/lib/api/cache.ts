export function memoize<T>(load: () => Promise<T>): (force?: boolean) => Promise<T> {
  let cache: Promise<T> | null = null
  return (force = false) => {
    if (!cache || force) {
      const request = load()
      request.catch(() => {
        if (cache === request) cache = null
      })
      cache = request
    }
    return cache
  }
}

export function memoizeBy<K, T>(load: (key: K) => Promise<T>): (key: K) => Promise<T> {
  const cache = new Map<K, Promise<T>>()
  return (key) => {
    const hit = cache.get(key)
    if (hit) return hit
    const request = load(key)
    request.catch(() => {
      if (cache.get(key) === request) cache.delete(key)
    })
    cache.set(key, request)
    return request
  }
}