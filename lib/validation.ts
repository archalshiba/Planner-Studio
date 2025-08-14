import type { GenerationRequest } from "@/types/project-plan"

interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateInput(request: GenerationRequest): ValidationResult {
  // Check if idea exists and is not empty
  if (!request.idea || typeof request.idea !== "string") {
    return {
      isValid: false,
      error: "Project idea is required and must be a string",
    }
  }

  // Trim and check length
  const trimmedIdea = request.idea.trim()
  if (trimmedIdea.length === 0) {
    return {
      isValid: false,
      error: "Project idea cannot be empty",
    }
  }

  if (trimmedIdea.length < 10) {
    return {
      isValid: false,
      error: "Project idea must be at least 10 characters long",
    }
  }

  if (trimmedIdea.length > 1000) {
    return {
      isValid: false,
      error: "Project idea must be less than 1000 characters",
    }
  }

  // Basic content validation - check for potentially harmful content
  const suspiciousPatterns = [/hack/i, /exploit/i, /malware/i, /virus/i, /illegal/i, /fraud/i]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmedIdea)) {
      return {
        isValid: false,
        error: "Project idea contains inappropriate content",
      }
    }
  }

  // Validate context if provided
  if (request.context) {
    const { context } = request

    if (context.projectType && typeof context.projectType !== "string") {
      return {
        isValid: false,
        error: "Project type must be a string",
      }
    }

    if (context.constraints && !Array.isArray(context.constraints)) {
      return {
        isValid: false,
        error: "Constraints must be an array",
      }
    }

    if (context.targetAudience && typeof context.targetAudience !== "string") {
      return {
        isValid: false,
        error: "Target audience must be a string",
      }
    }

    if (context.budget && typeof context.budget !== "string") {
      return {
        isValid: false,
        error: "Budget must be a string",
      }
    }
  }

  return { isValid: true }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+=/gi, "") // Remove event handlers
}
