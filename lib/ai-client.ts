import type { GenerationRequest, GenerationResponse } from "@/types/project-plan"

export class AIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : window.location.origin
  }

  async generatePlan(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        return {
          success: false,
          error: `Server returned non-JSON response. Status: ${response.status}`,
        }
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        return {
          success: false,
          error: "Invalid JSON response from server",
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        }
      }

      return data
    } catch (error) {
      console.error("AI Client Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
}

// Singleton instance
export const aiClient = new AIClient()
