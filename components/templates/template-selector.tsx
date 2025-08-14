"use client"

import { useState } from "react"
import type { ProjectTemplate, TemplateCategory } from "@/types/template"
import { PROJECT_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Zap } from "lucide-react"

interface TemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate | null) => void
  selectedTemplate: ProjectTemplate | null
}

export function TemplateSelector({ onSelectTemplate, selectedTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all")

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : activeCategory === "all"
      ? PROJECT_TEMPLATES
      : getTemplatesByCategory(activeCategory)

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Choose a Project Template</h3>
          <p className="text-sm text-muted-foreground">
            Select a template to get more targeted AI-generated plans, or skip to use a custom approach
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => onSelectTemplate(null)}
          className={selectedTemplate === null ? "bg-primary text-primary-foreground" : ""}
        >
          Custom Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as TemplateCategory | "all")}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {TEMPLATE_CATEGORIES.slice(0, 5).map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">{template.description}</CardDescription>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <Badge className={`text-xs ${getComplexityColor(template.estimatedComplexity)}`}>
                        {template.estimatedComplexity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTimeframe}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No templates found matching your search.</p>
          <Button variant="link" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
}
