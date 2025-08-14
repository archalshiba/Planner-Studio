"use client"

import type React from "react"
import { useState, memo, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import { LoadingState } from "@/components/plan/loading-state"
import { ProjectPlanDisplay } from "@/components/plan/project-plan-display"
import { TemplateSelector } from "@/components/templates/template-selector"
import { ContextualInput, type ContextualInputData } from "@/components/forms/contextual-input"
import { AIErrorBoundary } from "@/components/error/ai-error-boundary"
import { PlanErrorBoundary } from "@/components/error/plan-error-boundary"
import { aiClient } from "@/lib/ai-client"
import { cachedFetch } from "@/lib/cache"
import type { ProjectPlan } from "@/types/project-plan"
import type { ProjectTemplate } from "@/types/template"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const ExampleIdeas = memo(
  ({
    examples,
    onSelectIdea,
    templateName,
    isGenerating,
  }: {
    examples: string[]
    onSelectIdea: (idea: string) => void
    templateName?: string
    isGenerating: boolean
  }) => (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        {templateName ? `${templateName} examples:` : "Need inspiration? Try these examples:"}
      </h3>
      <div className="grid gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectIdea(example)}
            className="text-left p-3 text-sm bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={isGenerating}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  ),
)

ExampleIdeas.displayName = "ExampleIdeas"

export const IdeaInputForm = memo(function IdeaInputForm() {
  const [idea, setIdea] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [contextualData, setContextualData] = useState<ContextualInputData>({
    technicalConstraints: [],
    businessGoals: [],
    integrationRequirements: [],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<ProjectPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!idea.trim()) return

      setIsGenerating(true)
      setGeneratedPlan(null)
      setError(null)

      try {
        const response = await aiClient.generatePlan({
          idea: idea.trim(),
          templateId: selectedTemplate?.id,
          context: {
            projectType: selectedTemplate?.category || "web application",
            targetAudience: contextualData.targetAudience,
            budget: contextualData.budget,
            timeline: contextualData.timeline,
            teamSize: contextualData.teamSize,
            constraints: [
              ...(contextualData.technicalConstraints || []),
              ...(selectedTemplate?.prompts.constraints || []),
            ],
            businessGoals: contextualData.businessGoals,
            integrationRequirements: contextualData.integrationRequirements,
            additionalContext: contextualData.additionalContext,
          },
        })

        if (response.success && response.plan) {
          setGeneratedPlan(response.plan)
          if (user) {
            await savePlan(response.plan, idea.trim())
          }
        } else {
          setError(response.error || "Failed to generate project plan")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsGenerating(false)
      }
    },
    [idea, selectedTemplate, contextualData, user],
  )

  const savePlan = useCallback(
    async (plan: ProjectPlan, originalIdea: string) => {
      try {
        await cachedFetch("/api/plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: plan.title || "Untitled Project",
            description: plan.description || "AI-generated project plan",
            ideaInput: originalIdea,
            planData: plan,
          }),
        })

        toast({
          title: "Plan Saved",
          description: "Your project plan has been saved to your dashboard.",
        })
      } catch (error) {
        console.error("Failed to save plan:", error)
      }
    },
    [toast],
  )

  const handlePlanUpdate = useCallback(
    async (updatedPlan: ProjectPlan) => {
      if (!user || !updatedPlan.id) {
        throw new Error("User must be logged in and plan must have an ID to update")
      }

      await cachedFetch(`/api/plans/${updatedPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: updatedPlan,
        }),
      })

      setGeneratedPlan(updatedPlan)
      return updatedPlan
    },
    [user],
  )

  const handleExport = useCallback((format: "json" | "markdown" | "pdf") => {
    alert(`${format.toUpperCase()} export will be implemented in the next phase!`)
  }, [])

  const handleNewIdea = useCallback(() => {
    setGeneratedPlan(null)
    setIdea("")
    setError(null)
    setContextualData({
      technicalConstraints: [],
      businessGoals: [],
      integrationRequirements: [],
    })
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    handleSubmit(new Event("submit") as any)
  }, [handleSubmit])

  const exampleIdeas = useMemo(() => {
    if (selectedTemplate) {
      switch (selectedTemplate.id) {
        case "web-app-saas":
          return [
            "A project management tool for remote teams with time tracking",
            "A customer support platform with AI-powered ticket routing",
            "A social media scheduling tool for small businesses",
            "An expense tracking app for freelancers with invoice generation",
          ]
        case "mobile-app-native":
          return [
            "A fitness tracking app with workout plans and progress photos",
            "A meditation app with guided sessions and mood tracking",
            "A recipe app with meal planning and grocery list generation",
            "A language learning app with speech recognition and games",
          ]
        case "ecommerce-store":
          return [
            "An online marketplace for handmade crafts with artist profiles",
            "A subscription box service for specialty coffee beans",
            "A vintage clothing store with authentication and sizing guides",
            "A digital art marketplace with NFT integration",
          ]
        case "api-backend":
          return [
            "A weather data API with historical trends and forecasting",
            "A user authentication service with social login options",
            "A payment processing API with multi-currency support",
            "A content moderation API with AI-powered filtering",
          ]
        case "content-cms":
          return [
            "A blog platform for technical writers with code highlighting",
            "A portfolio website builder for creative professionals",
            "A documentation site generator for open source projects",
            "A news aggregation platform with personalized feeds",
          ]
        case "analytics-dashboard":
          return [
            "A social media analytics dashboard for marketing teams",
            "A sales performance tracker with forecasting capabilities",
            "A website traffic analyzer with conversion optimization tips",
            "A financial dashboard for small business expense tracking",
          ]
        default:
          return [
            "A mobile app for tracking plant watering schedules",
            "A SaaS platform for small business inventory management",
            "An e-commerce site for handmade crafts with social features",
            "A web app for collaborative project planning with teams",
          ]
      }
    }
    return [
      "A mobile app for tracking plant watering schedules",
      "A SaaS platform for small business inventory management",
      "An e-commerce site for handmade crafts with social features",
      "A web app for collaborative project planning with teams",
    ]
  }, [selectedTemplate])

  const placeholder = useMemo(() => {
    if (selectedTemplate) {
      return `Describe your ${selectedTemplate.name.toLowerCase()} idea. For example: ${exampleIdeas[0]}`
    }
    return "Example: A mobile app for tracking plant watering schedules with reminders and care tips..."
  }, [selectedTemplate, exampleIdeas])

  if (isGenerating) {
    return <LoadingState />
  }

  if (generatedPlan) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Button onClick={handleNewIdea} variant="outline">
            Generate New Plan
          </Button>
        </div>
        <PlanErrorBoundary onRegenerate={handleNewIdea} planData={generatedPlan}>
          <ProjectPlanDisplay
            plan={generatedPlan}
            onExport={handleExport}
            onPlanUpdate={user ? handlePlanUpdate : undefined}
          />
        </PlanErrorBoundary>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <TemplateSelector onSelectTemplate={setSelectedTemplate} selectedTemplate={selectedTemplate} />

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Describe Your Project Idea
          </CardTitle>
          <CardDescription>
            {selectedTemplate ? (
              <>
                Creating a <strong>{selectedTemplate.name}</strong>. {selectedTemplate.description}
                <br />
                <span className="text-xs text-muted-foreground mt-1 block">
                  Estimated complexity: {selectedTemplate.estimatedComplexity} • Timeline:{" "}
                  {selectedTemplate.estimatedTimeframe}
                </span>
              </>
            ) : (
              "Enter a brief description of your project concept. The more specific you are, the better the AI can help you."
            )}
            {user && (
              <span className="block mt-1 text-xs text-green-600 dark:text-green-400">
                Your plans will be automatically saved to your dashboard.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AIErrorBoundary onRetry={handleRetry}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Textarea
                  placeholder={placeholder}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
                <div className="text-sm text-slate-500 mt-2">{idea.length}/1000 characters</div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={!idea.trim() || isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Project Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Project Plan
                  </>
                )}
              </Button>
            </form>
          </AIErrorBoundary>

          <ExampleIdeas
            examples={exampleIdeas}
            onSelectIdea={setIdea}
            templateName={selectedTemplate?.name}
            isGenerating={isGenerating}
          />
        </CardContent>
      </Card>

      <div className="w-full max-w-2xl mx-auto">
        <ContextualInput onContextChange={setContextualData} initialContext={contextualData} />
      </div>
    </div>
  )
})
