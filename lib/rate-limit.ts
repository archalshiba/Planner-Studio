interface RateLimitConfig {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
}

const cache = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (limit: number, token: string): Promise<RateLimitResult> => {
      const now = Date.now()
      const key = `${token}`

      // Clean up expired entries
      for (const [k, v] of cache.entries()) {
        if (now > v.resetTime) {
          cache.delete(k)
        }
      }

      const record = cache.get(key)
      const resetTime = now + config.interval

      if (!record) {
        cache.set(key, { count: 1, resetTime })
        return { success: true, remaining: limit - 1 }
      }

      if (now > record.resetTime) {
        cache.set(key, { count: 1, resetTime })
        return { success: true, remaining: limit - 1 }
      }

      if (record.count >= limit) {
        return { success: false, remaining: 0 }
      }

      record.count++
      return { success: true, remaining: limit - record.count }
    },
  }
}
