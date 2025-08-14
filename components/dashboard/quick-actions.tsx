"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, History, Settings, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Create New Plan",
      description: "Generate a new project plan with AI",
      icon: Plus,
      href: "/",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View History",
      description: "Browse your previous project plans",
      icon: History,
      href: "/dashboard/history",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Templates",
      description: "Use pre-built project templates",
      icon: FileText,
      href: "/dashboard/templates",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Settings",
      description: "Manage your account preferences",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent"
              >
                <Link href={action.href}>
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
