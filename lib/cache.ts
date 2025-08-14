interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Generate cache key from request parameters
  generateKey(endpoint: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${JSON.stringify(params[key])}`)
      .join("&")

    return `${endpoint}?${sortedParams}`
  }
}

export const apiCache = new APICache()

export async function cachedFetch<T>(url: string, options: RequestInit = {}, ttl?: number): Promise<T> {
  const cacheKey = apiCache.generateKey(url, {
    method: options.method || "GET",
    body: options.body,
  })

  // Try to get from cache first
  const cached = apiCache.get<T>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch from API
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  // Cache the result
  apiCache.set(cacheKey, data, ttl)

  return data
}
