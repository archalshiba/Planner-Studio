"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Download, FileJson, FileText, FileImage, Settings, Loader2, ExternalLink } from "lucide-react"
import { ExportManager, ExportTemplates } from "@/lib/export-utils"
import { AVAILABLE_INTEGRATIONS } from "@/lib/integrations" // Added integration imports
import type { ProjectPlan } from "@/types/project-plan"

interface ExportButtonsProps {
  plan?: ProjectPlan
  onExport?: (format: "json" | "markdown" | "pdf") => void
  connectedIntegrations?: string[] // Added connected integrations prop
}

export function ExportButtons({ plan, onExport, connectedIntegrations = [] }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    template: "standard",
  })
  const { toast } = useToast()

  const handleQuickExport = async (format: "json" | "markdown" | "pdf") => {
    if (!plan) {
      toast({
        title: "No plan available",
        description: "Please generate a project plan first.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      await ExportManager.exportPlan(plan, {
        format,
        includeMetadata: exportOptions.includeMetadata,
      })

      toast({
        title: "Export successful",
        description: `Your project plan has been exported as ${format.toUpperCase()}.`,
      })

      if (onExport) {
        onExport(format)
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export project plan.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleIntegrationExport = async (integrationId: string) => {
    if (!plan) {
      toast({
        title: "No plan available",
        description: "Please generate a project plan first.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Simulate integration export API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)

      toast({
        title: "Export successful",
        description: `Your project plan has been exported to ${integration?.name}.`,
      })
    } catch (error) {
      console.error("Integration export error:", error)
      toast({
        title: "Export failed",
        description: "Failed to export to external tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleAdvancedExport = async (format: "json" | "markdown" | "pdf") => {
    if (!plan) return

    setIsExporting(true)

    try {
      let customContent: string | undefined

      if (exportOptions.template === "readme") {
        customContent = ExportTemplates.README(plan)
      } else if (exportOptions.template === "technical") {
        customContent = ExportTemplates.TECHNICAL_SPEC(plan)
      }

      await ExportManager.exportPlan(plan, {
        format,
        includeMetadata: exportOptions.includeMetadata,
        customTemplate: customContent,
      })

      toast({
        title: "Export successful",
        description: `Your project plan has been exported as ${format.toUpperCase()} with custom template.`,
      })

      setShowAdvancedDialog(false)
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export project plan.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSpecialExport = async (type: "readme" | "technical") => {
    if (!plan) return

    const content = type === "readme" ? ExportTemplates.README(plan) : ExportTemplates.TECHNICAL_SPEC(plan)
    const filename = `${plan.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${type}.md`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `${type === "readme" ? "README.md" : "Technical specification"} has been downloaded.`,
    })
  }

  const connectedIntegrationObjects = AVAILABLE_INTEGRATIONS.filter((integration) =>
    connectedIntegrations.includes(integration.id),
  )

  return (
    <div className="flex items-center gap-2">
      {/* Quick Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isExporting || !plan}>
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export Plan
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleQuickExport("json")}>
            <FileJson className="w-4 h-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport("markdown")}>
            <FileText className="w-4 h-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport("pdf")}>
            <FileImage className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>

          {connectedIntegrationObjects.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {connectedIntegrationObjects.map((integration) => (
                <DropdownMenuItem key={integration.id} onClick={() => handleIntegrationExport(integration.id)}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Export to {integration.name}
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAdvancedDialog(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Advanced Export...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Special Export Buttons */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={!plan}>
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSpecialExport("readme")}>
            <FileText className="w-4 h-4 mr-2" />
            Generate README.md
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSpecialExport("technical")}>
            <FileText className="w-4 h-4 mr-2" />
            Technical Specification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Export Dialog */}
      <Dialog open={showAdvancedDialog} onOpenChange={setShowAdvancedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Export Options</DialogTitle>
            <DialogDescription>Customize your export settings and choose a template.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Export Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Export Options</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({ ...prev, includeMetadata: checked as boolean }))
                  }
                />
                <Label htmlFor="metadata" className="text-sm">
                  Include metadata (creation date, original idea)
                </Label>
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Template</h4>
              <RadioGroup
                value={exportOptions.template}
                onValueChange={(value) => setExportOptions((prev) => ({ ...prev, template: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="text-sm">
                    Standard - Complete project plan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="readme" id="readme" />
                  <Label htmlFor="readme" className="text-sm">
                    README - Project documentation format
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical" id="technical" />
                  <Label htmlFor="technical" className="text-sm">
                    Technical Specification - Developer-focused
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Export Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAdvancedDialog(false)}>
                Cancel
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export As...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAdvancedExport("json")}>
                    <FileJson className="w-4 h-4 mr-2" />
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAdvancedExport("markdown")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAdvancedExport("pdf")}>
                    <FileImage className="w-4 h-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
