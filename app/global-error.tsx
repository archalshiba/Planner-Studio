"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">Application Error</CardTitle>
              <CardDescription>
                A critical error occurred that prevented the application from loading properly.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error.digest && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm">
                    <strong>Error ID:</strong> {error.digest}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={reset} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                If this error persists, please contact support with the error ID above.
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
