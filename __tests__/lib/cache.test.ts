import { apiCache, cachedFetch } from "@/lib/cache"
import type { jest } from "@jest/globals"

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe("APICache", () => {
  beforeEach(() => {
    apiCache.clear()
    mockFetch.mockClear()
  })

  it("stores and retrieves cached data", () => {
    const testData = { message: "test" }
    apiCache.set("test-key", testData)

    const retrieved = apiCache.get("test-key")
    expect(retrieved).toEqual(testData)
  })

  it("returns null for expired cache entries", () => {
    const testData = { message: "test" }
    apiCache.set("test-key", testData, 1) // 1ms TTL

    // Wait for expiration
    setTimeout(() => {
      const retrieved = apiCache.get("test-key")
      expect(retrieved).toBeNull()
    }, 10)
  })

  it("generates consistent cache keys", () => {
    const key1 = apiCache.generateKey("/api/test", { param1: "value1", param2: "value2" })
    const key2 = apiCache.generateKey("/api/test", { param2: "value2", param1: "value1" })

    expect(key1).toBe(key2)
  })
})

describe("cachedFetch", () => {
  beforeEach(() => {
    apiCache.clear()
    mockFetch.mockClear()
  })

  it("fetches data and caches it", async () => {
    const testData = { message: "test" }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as Response)

    const result = await cachedFetch("/api/test")
    expect(result).toEqual(testData)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Second call should use cache
    const result2 = await cachedFetch("/api/test")
    expect(result2).toEqual(testData)
    expect(mockFetch).toHaveBeenCalledTimes(1) // Still only called once
  })

  it("throws error for failed requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(cachedFetch("/api/test")).rejects.toThrow("HTTP error! status: 500")
  })
})
