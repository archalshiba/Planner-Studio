export interface ProjectPlan {
  id: string
  title: string
  originalIdea: string
  summary: string
  features: {
    mvp: string[]
    high: string[]
    optional: string[]
  }
  techStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    deployment: string[]
    other: string[]
  }
  uiux: {
    designPrinciples: string[]
    userExperience: string[]
    accessibility: string[]
  }
  security: {
    authentication: string[]
    dataProtection: string[]
    apiSecurity: string[]
  }
  testing: {
    unitTesting: string[]
    integrationTesting: string[]
    e2eTesting: string[]
  }
  deployment: {
    hosting: string[]
    cicd: string[]
    monitoring: string[]
  }
  roadmap: {
    phases: Array<{
      title: string
      description: string
      duration: string
      tasks: string[]
    }>
  }
  createdAt: string
  updatedAt: string
}

export interface GenerationRequest {
  idea: string
  templateId?: string // Added template ID for template-based generation
  context?: {
    projectType?: string
    constraints?: string[]
    targetAudience?: string
    budget?: string
  }
}

export interface GenerationResponse {
  success: boolean
  plan?: ProjectPlan
  error?: string
}
