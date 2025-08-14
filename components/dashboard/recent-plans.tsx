"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Download, Eye } from "lucide-react"

export function RecentPlans() {
  // TODO: Replace with real data from database
  const recentPlans = [
    {
      id: "1",
      title: "Plant Care Tracking App",
      description: "Mobile app for tracking plant watering schedules",
      createdAt: "2024-01-15",
      status: "completed",
      exports: 3,
    },
    {
      id: "2",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution for small businesses",
      createdAt: "2024-01-12",
      status: "in-progress",
      exports: 1,
    },
    {
      id: "3",
      title: "Task Management SaaS",
      description: "Collaborative task management platform",
      createdAt: "2024-01-10",
      status: "completed",
      exports: 5,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Recent Project Plans
        </CardTitle>
        <CardDescription>Your latest AI-generated project plans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPlans.map((plan) => (
            <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{plan.title}</h3>
                  <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{plan.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {plan.exports} exports
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
