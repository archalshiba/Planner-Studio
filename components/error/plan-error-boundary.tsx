"use client"

import { ErrorBoundary } from "./error-boundary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX, RefreshCw, Download } from "lucide-react"
import type { ReactNode } from "react"

interface PlanErrorBoundaryProps {
  children: ReactNode
  onRegenerate?: () => void
  planData?: any
}

export function PlanErrorBoundary({ children, onRegenerate, planData }: PlanErrorBoundaryProps) {
  const handleExportRawData = () => {
    if (planData) {
      const dataStr = JSON.stringify(planData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `plan-backup-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const fallback = (
    <div className="min-h-[300px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <FileX className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-blue-600 dark:text-blue-400">Plan Display Error</CardTitle>
          <CardDescription>
            There was an issue displaying your project plan. Your data is safe and can be recovered.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {onRegenerate && (
              <Button onClick={onRegenerate} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Plan
              </Button>
            )}

            {planData && (
              <Button variant="outline" onClick={handleExportRawData} className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Raw Data
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Your plan data is preserved and can be exported above
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <ErrorBoundary
      fallback={fallback}
      resetKeys={[planData]}
      onError={(error, errorInfo) => {
        console.error("Plan Display Error:", error, errorInfo)
        // Report plan-specific errors
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
