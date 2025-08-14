"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import PlanHistory from "@/components/plan/plan-history"
import { ProjectPlanDisplay } from "@/components/plan/project-plan-display"
import { ErrorBoundary } from "@/components/error/error-boundary"
import { PlanErrorBoundary } from "@/components/error/plan-error-boundary"
import type { ProjectPlan } from "@/types/project-plan"

export default function DashboardPage() {
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null)

  const handleSelectPlan = (plan: ProjectPlan) => {
    setSelectedPlan(plan)
  }

  const handleBackToDashboard = () => {
    setSelectedPlan(null)
  }

  if (selectedPlan) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <DashboardHeader />
          <main className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <button
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                ← Back to Dashboard
              </button>
              <PlanErrorBoundary onRegenerate={handleBackToDashboard} planData={selectedPlan}>
                <ProjectPlanDisplay
                  plan={selectedPlan}
                  onExport={(format) => {
                    // Export functionality already implemented in the component
                  }}
                />
              </PlanErrorBoundary>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <ErrorBoundary>
              <DashboardStats />
            </ErrorBoundary>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ErrorBoundary>
                  <PlanHistory onSelectPlan={handleSelectPlan} />
                </ErrorBoundary>
              </div>
              <div>
                <ErrorBoundary>
                  <QuickActions />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
