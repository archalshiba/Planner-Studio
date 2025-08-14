export interface ExternalIntegration {
  id: string
  name: string
  description: string
  icon: string
  category: IntegrationCategory
  isConnected: boolean
  requiresAuth: boolean
  supportedExports: ExportType[]
  configFields?: IntegrationConfigField[]
}

export type IntegrationCategory = "Project Management" | "Development" | "Communication" | "Documentation"

export type ExportType = "tasks" | "issues" | "repository" | "documentation" | "roadmap"

export interface IntegrationConfigField {
  key: string
  label: string
  type: "text" | "password" | "url" | "select"
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

export interface IntegrationExportRequest {
  integrationId: string
  planId: string
  exportType: ExportType
  config: Record<string, string>
}
