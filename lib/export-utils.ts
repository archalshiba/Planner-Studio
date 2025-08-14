import type { ProjectPlan } from "@/types/project-plan"

export interface ExportOptions {
  format: "json" | "markdown" | "pdf"
  includeMetadata?: boolean
  customTemplate?: string
}

export class ExportManager {
  static async exportPlan(plan: ProjectPlan, options: ExportOptions): Promise<void> {
    const { format } = options

    switch (format) {
      case "json":
        await this.exportAsJSON(plan, options)
        break
      case "markdown":
        await this.exportAsMarkdown(plan, options)
        break
      case "pdf":
        await this.exportAsPDF(plan, options)
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  private static async exportAsJSON(plan: ProjectPlan, options: ExportOptions): Promise<void> {
    const exportData = options.includeMetadata
      ? plan
      : {
          title: plan.title,
          summary: plan.summary,
          features: plan.features,
          techStack: plan.techStack,
          uiux: plan.uiux,
          security: plan.security,
          testing: plan.testing,
          deployment: plan.deployment,
          roadmap: plan.roadmap,
        }

    const jsonString = JSON.stringify(exportData, null, 2)
    const filename = `${this.sanitizeFilename(plan.title)}-plan.json`

    this.downloadFile(jsonString, filename, "application/json")
  }

  private static async exportAsMarkdown(plan: ProjectPlan, options: ExportOptions): Promise<void> {
    const markdownContent = this.generateMarkdownContent(plan, options)
    const filename = `${this.sanitizeFilename(plan.title)}-plan.md`

    this.downloadFile(markdownContent, filename, "text/markdown")
  }

  private static async exportAsPDF(plan: ProjectPlan, options: ExportOptions): Promise<void> {
    // Dynamic import to reduce bundle size
    const { jsPDF } = await import("jspdf")

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont("helvetica", "bold")
      } else {
        doc.setFont("helvetica", "normal")
      }

      const lines = doc.splitTextToSize(text, maxWidth)
      const lineHeight = fontSize * 0.4

      // Check if we need a new page
      if (yPosition + lines.length * lineHeight > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }

      doc.text(lines, margin, yPosition)
      yPosition += lines.length * lineHeight + 5
    }

    // Add title
    addText(plan.title, 20, true)
    yPosition += 10

    // Add metadata
    if (options.includeMetadata) {
      addText(`Generated: ${new Date(plan.createdAt).toLocaleDateString()}`, 10)
      addText(`Original Idea: ${plan.originalIdea}`, 10)
      yPosition += 10
    }

    // Add summary
    addText("Project Summary", 16, true)
    addText(plan.summary)
    yPosition += 10

    // Add features
    addText("Features & Requirements", 16, true)
    addText("MVP Features:", 14, true)
    plan.features.mvp.forEach((feature) => addText(`• ${feature}`))

    addText("High Priority Features:", 14, true)
    plan.features.high.forEach((feature) => addText(`• ${feature}`))

    addText("Optional Features:", 14, true)
    plan.features.optional.forEach((feature) => addText(`• ${feature}`))
    yPosition += 10

    // Add tech stack
    addText("Technology Stack", 16, true)
    Object.entries(plan.techStack).forEach(([category, technologies]) => {
      if (technologies.length > 0) {
        addText(`${category.charAt(0).toUpperCase() + category.slice(1)}:`, 14, true)
        technologies.forEach((tech) => addText(`• ${tech}`))
      }
    })
    yPosition += 10

    // Add roadmap
    addText("Development Roadmap", 16, true)
    plan.roadmap.phases.forEach((phase, index) => {
      addText(`Phase ${index + 1}: ${phase.title}`, 14, true)
      addText(`Duration: ${phase.duration}`)
      addText(phase.description)
      addText("Tasks:", 12, true)
      phase.tasks.forEach((task) => addText(`• ${task}`))
      yPosition += 5
    })

    const filename = `${this.sanitizeFilename(plan.title)}-plan.pdf`
    doc.save(filename)
  }

  private static generateMarkdownContent(plan: ProjectPlan, options: ExportOptions): string {
    let content = `# ${plan.title}\n\n`

    if (options.includeMetadata) {
      content += `**Generated:** ${new Date(plan.createdAt).toLocaleDateString()}\n`
      content += `**Original Idea:** ${plan.originalIdea}\n\n`
    }

    content += `## Project Summary\n\n${plan.summary}\n\n`

    // Features
    content += `## Features & Requirements\n\n`
    content += `### MVP Features\n${plan.features.mvp.map((f) => `- ${f}`).join("\n")}\n\n`
    content += `### High Priority Features\n${plan.features.high.map((f) => `- ${f}`).join("\n")}\n\n`
    content += `### Optional Features\n${plan.features.optional.map((f) => `- ${f}`).join("\n")}\n\n`

    // Tech Stack
    content += `## Technology Stack\n\n`
    Object.entries(plan.techStack).forEach(([category, technologies]) => {
      if (technologies.length > 0) {
        content += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`
        content += `${technologies.map((t) => `- ${t}`).join("\n")}\n\n`
      }
    })

    // UI/UX
    content += `## UI/UX Considerations\n\n`
    content += `### Design Principles\n${plan.uiux.designPrinciples.map((p) => `- ${p}`).join("\n")}\n\n`
    content += `### User Experience\n${plan.uiux.userExperience.map((u) => `- ${u}`).join("\n")}\n\n`
    content += `### Accessibility\n${plan.uiux.accessibility.map((a) => `- ${a}`).join("\n")}\n\n`

    // Security
    content += `## Security & Privacy\n\n`
    content += `### Authentication\n${plan.security.authentication.map((a) => `- ${a}`).join("\n")}\n\n`
    content += `### Data Protection\n${plan.security.dataProtection.map((d) => `- ${d}`).join("\n")}\n\n`
    content += `### API Security\n${plan.security.apiSecurity.map((s) => `- ${s}`).join("\n")}\n\n`

    // Testing
    content += `## Testing Strategy\n\n`
    content += `### Unit Testing\n${plan.testing.unitTesting.map((t) => `- ${t}`).join("\n")}\n\n`
    content += `### Integration Testing\n${plan.testing.integrationTesting.map((t) => `- ${t}`).join("\n")}\n\n`
    content += `### End-to-End Testing\n${plan.testing.e2eTesting.map((t) => `- ${t}`).join("\n")}\n\n`

    // Deployment
    content += `## Deployment & Infrastructure\n\n`
    content += `### Hosting\n${plan.deployment.hosting.map((h) => `- ${h}`).join("\n")}\n\n`
    content += `### CI/CD\n${plan.deployment.cicd.map((c) => `- ${c}`).join("\n")}\n\n`
    content += `### Monitoring\n${plan.deployment.monitoring.map((m) => `- ${m}`).join("\n")}\n\n`

    // Roadmap
    content += `## Development Roadmap\n\n`
    plan.roadmap.phases.forEach((phase, index) => {
      content += `### Phase ${index + 1}: ${phase.title}\n`
      content += `**Duration:** ${phase.duration}\n\n`
      content += `${phase.description}\n\n`
      content += `**Tasks:**\n${phase.tasks.map((task) => `- ${task}`).join("\n")}\n\n`
    })

    if (options.includeMetadata) {
      content += `---\n*Generated by Idea Architect on ${new Date(plan.createdAt).toLocaleDateString()}*\n`
    }

    return content
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  private static sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }
}

// Export templates for different use cases
export const ExportTemplates = {
  README: (plan: ProjectPlan) => `# ${plan.title}

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
`,

  TECHNICAL_SPEC: (plan: ProjectPlan) => `# ${plan.title} - Technical Specification

## Overview
${plan.summary}

## Architecture

### Frontend Architecture
${plan.techStack.frontend.map((t) => `- ${t}`).join("\n")}

### Backend Architecture
${plan.techStack.backend.map((t) => `- ${t}`).join("\n")}

### Database Design
${plan.techStack.database.map((t) => `- ${t}`).join("\n")}

## Security Requirements
${plan.security.authentication
  .concat(plan.security.dataProtection, plan.security.apiSecurity)
  .map((s) => `- ${s}`)
  .join("\n")}

## Testing Strategy
${plan.testing.unitTesting
  .concat(plan.testing.integrationTesting, plan.testing.e2eTesting)
  .map((t) => `- ${t}`)
  .join("\n")}

## Deployment Strategy
${plan.deployment.hosting
  .concat(plan.deployment.cicd, plan.deployment.monitoring)
  .map((d) => `- ${d}`)
  .join("\n")}

## Implementation Timeline
${plan.roadmap.phases
  .map(
    (phase, index) => `
### Phase ${index + 1}: ${phase.title} (${phase.duration})
${phase.tasks.map((task) => `- ${task}`).join("\n")}
`,
  )
  .join("\n")}
`,
}
