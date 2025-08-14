import type { Metadata } from "next"
import { Suspense, lazy } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingState } from "@/components/plan/loading-state"

const IdeaInputForm = lazy(() =>
  import("@/components/forms/idea-input-form").then((module) => ({ default: module.IdeaInputForm })),
)

export const metadata: Metadata = {
  title: "Idea Architect - Transform Ideas into Developer-Ready Plans",
  description:
    "AI-powered tool that transforms brief project concepts into comprehensive, developer-ready product plans with features, tech stack, and roadmaps.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Idea Architect
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform your brief project ideas into comprehensive, developer-ready product plans powered by AI
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Advanced AI transforms simple ideas into detailed project blueprints
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Comprehensive Plans</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Complete with features, tech stack, security, and deployment strategies
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Export Ready</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Export plans in JSON, Markdown, or PDF formats for easy sharing
                </p>
              </div>
            </div>
          </div>

          {/* Main Input Form */}
          <Suspense fallback={<LoadingState message="Loading form..." />}>
            <IdeaInputForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
