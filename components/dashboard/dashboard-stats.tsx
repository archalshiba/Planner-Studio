"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Download, TrendingUp } from "lucide-react"

export function DashboardStats() {
  // TODO: Replace with real data from database
  const stats = [
    {
      title: "Total Plans",
      value: "12",
      description: "Project plans created",
      icon: FileText,
      trend: "+2 this week",
    },
    {
      title: "Time Saved",
      value: "24h",
      description: "Estimated planning time saved",
      icon: Clock,
      trend: "+4h this week",
    },
    {
      title: "Exports",
      value: "18",
      description: "Plans exported",
      icon: Download,
      trend: "+3 this week",
    },
    {
      title: "Success Rate",
      value: "94%",
      description: "Plans successfully implemented",
      icon: TrendingUp,
      trend: "+2% this month",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
