export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  icon: string
  tags: string[]
  prompts: {
    context: string
    constraints: string[]
    focusAreas: string[]
  }
  defaultSections: string[]
  estimatedComplexity: "Simple" | "Medium" | "Complex"
  estimatedTimeframe: string
}

export type TemplateCategory =
  | "Web Application"
  | "Mobile App"
  | "Desktop Software"
  | "API/Backend"
  | "E-commerce"
  | "Content Management"
  | "Analytics/Data"
  | "Gaming"
  | "IoT/Hardware"
  | "AI/ML"

export interface TemplateLibrary {
  templates: ProjectTemplate[]
  categories: TemplateCategory[]
}
