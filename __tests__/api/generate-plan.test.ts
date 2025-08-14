import { POST } from "@/app/api/generate-plan/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock the Gemini API
global.fetch = jest.fn()
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe("/api/generate-plan", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    process.env.GEMINI_API_KEY = "test-api-key"
  })

  it("generates a project plan successfully", async () => {
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  title: "Test Project",
                  description: "A test project",
                  features: { core: ["Feature 1"] },
                  techStack: { frontend: ["React"] },
                  roadmap: { phases: [] },
                }),
              },
            ],
          },
        },
      ],
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeminiResponse,
    } as Response)

    const request = new NextRequest("http://localhost:3000/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({
        idea: "A todo app",
        context: { projectType: "web application" },
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plan.title).toBe("Test Project")
  })

  it("handles missing API key", async () => {
    delete process.env.GEMINI_API_KEY

    const request = new NextRequest("http://localhost:3000/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({
        idea: "A todo app",
        context: { projectType: "web application" },
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toContain("API key")
  })

  it("handles invalid request body", async () => {
    const request = new NextRequest("http://localhost:3000/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain("required")
  })
})
