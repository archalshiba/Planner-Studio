"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Brain, FileText, Code, Shield, TestTube, Rocket, Map } from "lucide-react"
import { useState, useEffect } from "react"

interface LoadingStateProps {
  stage?: string
  progress?: number
}

export function LoadingState({ stage = "Analyzing your idea", progress = 0 }: LoadingStateProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)

  const stages = [
    { icon: Brain, text: "Analyzing your project idea", duration: 2000 },
    { icon: FileText, text: "Generating feature requirements", duration: 3000 },
    { icon: Code, text: "Selecting optimal tech stack", duration: 2500 },
    { icon: Shield, text: "Planning security measures", duration: 2000 },
    { icon: TestTube, text: "Designing testing strategy", duration: 2000 },
    { icon: Rocket, text: "Creating deployment plan", duration: 2000 },
    { icon: Map, text: "Building development roadmap", duration: 3000 },
    { icon: Sparkles, text: "Finalizing your project plan", duration: 1500 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= 100) {
          return 100
        }
        return prev + 1
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length)
    }, 2500)

    return () => clearInterval(stageTimer)
  }, [])

  const CurrentIcon = stages[currentStage].icon

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Loading Card */}
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Creating Your Project Plan</h2>
          <p className="text-slate-600 dark:text-slate-400">{stages[currentStage].text}</p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Progress value={currentProgress} className="w-full" />
            <div className="text-center text-sm text-slate-500">{currentProgress}% Complete</div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeleton Sections */}
      <div className="space-y-4">
        {["Project Summary", "Features & Requirements", "Technology Stack", "Development Roadmap"].map(
          (title, index) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Stage Indicators */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-2">
            {stages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStage ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
