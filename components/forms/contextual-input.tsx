"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Plus, X, Settings } from "lucide-react"

export interface ContextualInputData {
  targetAudience?: string
  budget?: string
  timeline?: string
  teamSize?: string
  technicalConstraints: string[]
  businessGoals: string[]
  integrationRequirements: string[]
  additionalContext?: string
}

interface ContextualInputProps {
  onContextChange: (context: ContextualInputData) => void
  initialContext?: ContextualInputData
}

export function ContextualInput({ onContextChange, initialContext }: ContextualInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [context, setContext] = useState<ContextualInputData>(
    initialContext || {
      technicalConstraints: [],
      businessGoals: [],
      integrationRequirements: [],
    },
  )

  const updateContext = (updates: Partial<ContextualInputData>) => {
    const newContext = { ...context, ...updates }
    setContext(newContext)
    onContextChange(newContext)
  }

  const addArrayItem = (
    field: keyof Pick<ContextualInputData, "technicalConstraints" | "businessGoals" | "integrationRequirements">,
    value: string,
  ) => {
    if (value.trim() && !context[field].includes(value.trim())) {
      updateContext({
        [field]: [...context[field], value.trim()],
      })
    }
  }

  const removeArrayItem = (
    field: keyof Pick<ContextualInputData, "technicalConstraints" | "businessGoals" | "integrationRequirements">,
    index: number,
  ) => {
    updateContext({
      [field]: context[field].filter((_, i) => i !== index),
    })
  }

  const ArrayInput = ({
    field,
    label,
    placeholder,
    suggestions,
  }: {
    field: keyof Pick<ContextualInputData, "technicalConstraints" | "businessGoals" | "integrationRequirements">
    label: string
    placeholder: string
    suggestions: string[]
  }) => {
    const [inputValue, setInputValue] = useState("")

    const handleAdd = () => {
      addArrayItem(field, inputValue)
      setInputValue("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAdd()
      }
    }

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button type="button" onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {context[field].length > 0 && (
          <div className="flex flex-wrap gap-2">
            {context[field].map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Suggestions:</Label>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => addArrayItem(field, suggestion)}
                  disabled={context[field].includes(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const technicalSuggestions = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Vercel",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST API",
    "Microservices",
    "Mobile-first",
    "PWA",
    "Real-time",
    "Offline support",
    "High availability",
  ]

  const businessGoalSuggestions = [
    "Increase revenue",
    "Reduce costs",
    "Improve efficiency",
    "Scale operations",
    "Better user experience",
    "Market expansion",
    "Competitive advantage",
    "Data-driven decisions",
    "Automation",
    "Customer retention",
    "Brand awareness",
  ]

  const integrationSuggestions = [
    "Payment processing",
    "Email marketing",
    "CRM system",
    "Analytics",
    "Social media",
    "Cloud storage",
    "Authentication",
    "Notification service",
    "Search engine",
    "Third-party APIs",
    "Webhook support",
    "Data export/import",
  ]

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <CardTitle className="text-base">Advanced Context</CardTitle>
              </div>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            <CardDescription>Provide additional context to get more targeted project recommendations</CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Input
                  id="target-audience"
                  placeholder="e.g., Small business owners, Students, Developers"
                  value={context.targetAudience || ""}
                  onChange={(e) => updateContext({ targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={context.budget || ""} onValueChange={(value) => updateContext({ budget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-25k">$5,000 - $25,000</SelectItem>
                    <SelectItem value="25k-100k">$25,000 - $100,000</SelectItem>
                    <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                    <SelectItem value="over-500k">Over $500,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={context.timeline || ""} onValueChange={(value) => updateContext({ timeline: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-12-months">6-12 months</SelectItem>
                    <SelectItem value="over-1-year">Over 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-size">Team Size</Label>
                <Select value={context.teamSize || ""} onValueChange={(value) => updateContext({ teamSize: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo developer</SelectItem>
                    <SelectItem value="small">Small team (2-5)</SelectItem>
                    <SelectItem value="medium">Medium team (6-15)</SelectItem>
                    <SelectItem value="large">Large team (15+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ArrayInput
              field="technicalConstraints"
              label="Technical Constraints & Preferences"
              placeholder="e.g., Must use React, No PHP, Cloud-native"
              suggestions={technicalSuggestions}
            />

            <ArrayInput
              field="businessGoals"
              label="Business Goals"
              placeholder="e.g., Increase user engagement, Reduce manual work"
              suggestions={businessGoalSuggestions}
            />

            <ArrayInput
              field="integrationRequirements"
              label="Integration Requirements"
              placeholder="e.g., Stripe payments, Mailchimp, Slack"
              suggestions={integrationSuggestions}
            />

            <div className="space-y-2">
              <Label htmlFor="additional-context">Additional Context</Label>
              <Textarea
                id="additional-context"
                placeholder="Any other important details, constraints, or requirements..."
                value={context.additionalContext || ""}
                onChange={(e) => updateContext({ additionalContext: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
