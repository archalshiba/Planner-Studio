import { type NextRequest, NextResponse } from "next/server"
import { getProjectTemplateById } from "@/lib/templates"

function createProjectPlanPrompt(idea: string, context?: any, template?: any): string {
  let prompt = `Create a comprehensive project plan for this idea: "${idea}"`

  if (template) {
    prompt += `\n\nProject Template: ${template.name}`
    prompt += `\nTemplate Description: ${template.description}`
    prompt += `\nTemplate Context: ${template.prompts.context}`

    if (template.prompts.constraints.length > 0) {
      prompt += `\nTemplate Constraints: ${template.prompts.constraints.join(", ")}`
    }

    if (template.prompts.focusAreas.length > 0) {
      prompt += `\nFocus Areas: ${template.prompts.focusAreas.join(", ")}`
    }

    prompt += `\nEstimated Complexity: ${template.estimatedComplexity}`
    prompt += `\nEstimated Timeframe: ${template.estimatedTimeframe}`
  }

  if (context) {
    if (context.projectType) {
      prompt += `\n\nProject Type: ${context.projectType}`
    }
    if (context.targetAudience) {
      prompt += `\nTarget Audience: ${context.targetAudience}`
    }
    if (context.budget) {
      prompt += `\nBudget Range: ${context.budget}`
    }
    // Added new contextual input fields
    if (context.timeline) {
      prompt += `\nTimeline: ${context.timeline}`
    }
    if (context.teamSize) {
      prompt += `\nTeam Size: ${context.teamSize}`
    }
    if (context.constraints && context.constraints.length > 0) {
      prompt += `\nTechnical Constraints: ${context.constraints.join(", ")}`
    }
    if (context.businessGoals && context.businessGoals.length > 0) {
      prompt += `\nBusiness Goals: ${context.businessGoals.join(", ")}`
    }
    if (context.integrationRequirements && context.integrationRequirements.length > 0) {
      prompt += `\nIntegration Requirements: ${context.integrationRequirements.join(", ")}`
    }
    if (context.additionalContext) {
      prompt += `\nAdditional Context: ${context.additionalContext}`
    }
  }

  prompt += `

Please provide:
1. A clear, compelling project title
2. A comprehensive summary (2-3 sentences)
3. Features organized by priority (MVP, High Priority, Optional)
4. Modern, appropriate technology stack recommendations
5. UI/UX considerations including accessibility
6. Security measures and best practices
7. Testing strategy across all levels
8. Deployment and infrastructure recommendations
9. A realistic 3-phase development roadmap with specific tasks

Focus on:
- Modern, widely-adopted technologies
- Scalable architecture patterns
- Security-first approach
- Accessibility compliance
- Realistic timelines and scope
- Practical, actionable recommendations
${context?.timeline ? `- Timeline constraints: ${context.timeline}` : ""}
${context?.budget ? `- Budget considerations: ${context.budget}` : ""}
${context?.teamSize ? `- Team size optimization: ${context.teamSize}` : ""}

Respond only with valid JSON matching the required structure.`

  return prompt
}

function extractJsonFromText(text: string): string {
  // Remove markdown code blocks
  const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")

  // Find the first { and last } to extract JSON
  const firstBrace = cleanedText.indexOf("{")
  const lastBrace = cleanedText.lastIndexOf("}")

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in response")
  }

  return cleanedText.substring(firstBrace, lastBrace + 1)
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const body = await request.json()
    const { idea, templateId, context } = body

    // Validate required fields
    if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Idea is required and must be a non-empty string",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Get template if provided
    let template = null
    if (templateId) {
      template = getProjectTemplateById(templateId)
    }

    // Create the prompt
    const prompt = createProjectPlanPrompt(idea, context, template)

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini API error:", errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`,
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const geminiData = await geminiResponse.json()

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No response generated from Gemini API",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text

    try {
      // Extract and parse JSON from the response
      const jsonText = extractJsonFromText(generatedText)
      const plan = JSON.parse(jsonText)

      // Add metadata
      plan.id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      plan.createdAt = new Date().toISOString()
      plan.templateId = templateId || null

      return NextResponse.json(
        {
          success: true,
          plan,
        },
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError)
      console.error("Raw response:", generatedText)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse AI response. Please try again.",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("Generate plan error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while generating the plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
