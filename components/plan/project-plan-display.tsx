"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Code,
  Shield,
  TestTube,
  Rocket,
  Map,
  Lightbulb,
  Settings,
  Check,
  Edit,
} from "lucide-react"
import type { ProjectPlan } from "@/types/project-plan"
import { PlanSection } from "./plan-section"
import { EditablePlanSection } from "./editable-plan-section"
import { ExportButtons } from "./export-buttons"

interface ProjectPlanDisplayProps {
  plan: ProjectPlan
  onExport?: (format: "json" | "markdown" | "pdf") => void
  onPlanUpdate?: (updatedPlan: ProjectPlan) => void
}

export function ProjectPlanDisplay({ plan, onExport, onPlanUpdate }: ProjectPlanDisplayProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["summary", "features"]))
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set())
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set())
  const [updatedPlan, setUpdatedPlan] = useState<ProjectPlan>(plan)
  const { toast } = useToast()

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const copyToClipboard = async (content: string, sectionId?: string, description?: string) => {
    try {
      await navigator.clipboard.writeText(content)

      if (sectionId) {
        setCopiedSections((prev) => new Set(prev).add(sectionId))
        setTimeout(() => {
          setCopiedSections((prev) => {
            const newSet = new Set(prev)
            newSet.delete(sectionId)
            return newSet
          })
        }, 2000)
      }

      toast({
        title: "Copied to clipboard",
        description: description || "Content has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copySection = async (sectionId: string, content: any, title: string) => {
    let textContent = `# ${title}\n\n`

    if (typeof content === "string") {
      textContent += content
    } else if (Array.isArray(content)) {
      textContent += content.map((item) => `• ${item}`).join("\n")
    } else if (typeof content === "object") {
      textContent += formatObjectAsText(content)
    }

    await copyToClipboard(textContent, sectionId, `${title} section copied`)
  }

  const copyEntirePlan = async () => {
    const planText = formatPlanAsMarkdown(updatedPlan)
    await copyToClipboard(planText, "entire-plan", "Entire project plan copied")
  }

  const startEditing = (sectionId: string) => {
    setEditingSections((prev) => new Set(prev).add(sectionId))
    setOpenSections((prev) => new Set(prev).add(sectionId))
  }

  const stopEditing = (sectionId: string) => {
    setEditingSections((prev) => {
      const newSet = new Set(prev)
      newSet.delete(sectionId)
      return newSet
    })
  }

  const handleSectionUpdate = async (sectionId: string, newContent: any) => {
    const newPlan = { ...updatedPlan }

    switch (sectionId) {
      case "summary":
        newPlan.summary = newContent
        break
      case "features":
        newPlan.features = newContent
        break
      case "techStack":
        newPlan.techStack = newContent
        break
      case "uiux":
        newPlan.uiux = newContent
        break
      case "security":
        newPlan.security = newContent
        break
      case "testing":
        newPlan.testing = newContent
        break
      case "deployment":
        newPlan.deployment = newContent
        break
      case "roadmap":
        newPlan.roadmap = newContent
        break
    }

    setUpdatedPlan(newPlan)
    stopEditing(sectionId)

    if (onPlanUpdate) {
      try {
        await onPlanUpdate(newPlan)
        toast({
          title: "Section updated",
          description: "Your changes have been saved successfully.",
        })
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const sections = [
    {
      id: "summary",
      title: "Project Summary",
      icon: Lightbulb,
      content: updatedPlan.summary,
      description: "High-level overview of your project",
    },
    {
      id: "features",
      title: "Features & Requirements",
      icon: FileText,
      content: updatedPlan.features,
      description: "Core features organized by priority",
    },
    {
      id: "techStack",
      title: "Technology Stack",
      icon: Code,
      content: updatedPlan.techStack,
      description: "Recommended technologies and frameworks",
    },
    {
      id: "uiux",
      title: "UI/UX Considerations",
      icon: Settings,
      content: updatedPlan.uiux,
      description: "Design principles and user experience guidelines",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      content: updatedPlan.security,
      description: "Security measures and privacy considerations",
    },
    {
      id: "testing",
      title: "Testing Strategy",
      icon: TestTube,
      content: updatedPlan.testing,
      description: "Testing approach and quality assurance",
    },
    {
      id: "deployment",
      title: "Deployment & Infrastructure",
      icon: Rocket,
      content: updatedPlan.deployment,
      description: "Hosting and deployment recommendations",
    },
    {
      id: "roadmap",
      title: "Development Roadmap",
      icon: Map,
      content: updatedPlan.roadmap,
      description: "Phased development timeline",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{updatedPlan.title}</CardTitle>
              <CardDescription className="text-base">
                Generated project plan • {new Date(updatedPlan.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyEntirePlan}
                className="flex items-center gap-2 bg-transparent"
              >
                {copiedSections.has("entire-plan") ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy All
              </Button>
              <ExportButtons plan={updatedPlan} onExport={onExport} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Plan Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          const isOpen = openSections.has(section.id)
          const isCopied = copiedSections.has(section.id)
          const isEditing = editingSections.has(section.id)

          return (
            <Card key={section.id}>
              <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(section.id)
                          }}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copySection(section.id, section.content, section.title)
                          }}
                          className="flex items-center gap-1"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {isEditing ? (
                      <EditablePlanSection
                        content={section.content}
                        sectionType={section.id}
                        onSave={(newContent) => handleSectionUpdate(section.id, newContent)}
                        onCancel={() => stopEditing(section.id)}
                      />
                    ) : (
                      <PlanSection content={section.content} sectionType={section.id} />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={copyEntirePlan}>
              <Copy className="w-4 h-4 mr-2" />
              Copy All Sections
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generateReadmeContent(updatedPlan), undefined, "README.md content copied")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate README
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatObjectAsText(obj: any, indent = 0): string {
  const spaces = "  ".repeat(indent)
  let result = ""

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = key.replace(/([A-Z])/g, " $1").trim()
    const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1)

    if (Array.isArray(value)) {
      result += `${spaces}## ${capitalizedKey}\n`
      result += value.map((item) => `${spaces}• ${item}`).join("\n") + "\n\n"
    } else if (typeof value === "object" && value !== null) {
      result += `${spaces}## ${capitalizedKey}\n`
      result += formatObjectAsText(value, indent + 1)
    } else {
      result += `${spaces}## ${capitalizedKey}\n${spaces}${value}\n\n`
    }
  }

  return result
}

function formatPlanAsMarkdown(plan: ProjectPlan): string {
  return `# ${plan.title}

## Project Summary
${plan.summary}

## Features & Requirements

### MVP Features
${plan.features.mvp.map((f) => `• ${f}`).join("\n")}

### High Priority Features
${plan.features.high.map((f) => `• ${f}`).join("\n")}

### Optional Features
${plan.features.optional.map((f) => `• ${f}`).join("\n")}

## Technology Stack

### Frontend
${plan.techStack.frontend.map((t) => `• ${t}`).join("\n")}

### Backend
${plan.techStack.backend.map((t) => `• ${t}`).join("\n")}

### Database
${plan.techStack.database.map((t) => `• ${t}`).join("\n")}

### Deployment
${plan.techStack.deployment.map((t) => `• ${t}`).join("\n")}

### Other Technologies
${plan.techStack.other.map((t) => `• ${t}`).join("\n")}

## UI/UX Considerations

### Design Principles
${plan.uiux.designPrinciples.map((p) => `• ${p}`).join("\n")}

### User Experience
${plan.uiux.userExperience.map((u) => `• ${u}`).join("\n")}

### Accessibility
${plan.uiux.accessibility.map((a) => `• ${a}`).join("\n")}

## Security & Privacy

### Authentication
${plan.security.authentication.map((a) => `• ${a}`).join("\n")}

### Data Protection
${plan.security.dataProtection.map((d) => `• ${d}`).join("\n")}

### API Security
${plan.security.apiSecurity.map((s) => `• ${s}`).join("\n")}

## Testing Strategy

### Unit Testing
${plan.testing.unitTesting.map((t) => `• ${t}`).join("\n")}

### Integration Testing
${plan.testing.integrationTesting.map((t) => `• ${t}`).join("\n")}

### End-to-End Testing
${plan.testing.e2eTesting.map((t) => `• ${t}`).join("\n")}

## Deployment & Infrastructure

### Hosting
${plan.deployment.hosting.map((h) => `• ${h}`).join("\n")}

### CI/CD
${plan.deployment.cicd.map((c) => `• ${c}`).join("\n")}

### Monitoring
${plan.deployment.monitoring.map((m) => `• ${m}`).join("\n")}

## Development Roadmap

${plan.roadmap.phases
  .map(
    (phase, index) => `
### ${phase.title}
**Duration:** ${phase.duration}

${phase.description}

**Tasks:**
${phase.tasks.map((task) => `• ${task}`).join("\n")}
`,
  )
  .join("\n")}

---
*Generated by Idea Architect on ${new Date(plan.createdAt).toLocaleDateString()}*`
}

function generateReadmeContent(plan: ProjectPlan): string {
  return `# ${plan.title}

${plan.summary}

## Features

### Core Features (MVP)
${plan.features.mvp.map((f) => `- ${f}`).join("\n")}

### Enhanced Features
${plan.features.high.map((f) => `- ${f}`).join("\n")}

### Future Features
${plan.features.optional.map((f) => `- ${f}`).join("\n")}

## Tech Stack

- **Frontend:** ${plan.techStack.frontend.join(", ")}
- **Backend:** ${plan.techStack.backend.join(", ")}
- **Database:** ${plan.techStack.database.join(", ")}
- **Deployment:** ${plan.techStack.deployment.join(", ")}

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server

## Development Roadmap

${plan.roadmap.phases
  .map(
    (phase, index) => `
### Phase ${index + 1}: ${phase.title}
*${phase.duration}*

${phase.description}
`,
  )
  .join("\n")}

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
`
}
