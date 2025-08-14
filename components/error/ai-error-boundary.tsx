"use client"

import { ErrorBoundary } from "./error-boundary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, RefreshCw } from "lucide-react"
import type { ReactNode } from "react"

interface AIErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
}

export function AIErrorBoundary({ children, onRetry }: AIErrorBoundaryProps) {
  const fallback = (
    <div className="min-h-[300px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-orange-600 dark:text-orange-400">AI Service Error</CardTitle>
          <CardDescription>
            There was an issue with the AI generation service. This might be due to high demand or a temporary outage.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Check your internet connection</p>
            <p>• Try again in a few moments</p>
            <p>• Contact support if the issue persists</p>
          </div>

          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Generation
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error("AI Error:", error, errorInfo)
        // Report AI-specific errors with additional context
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
