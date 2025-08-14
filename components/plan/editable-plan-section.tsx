"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save, DeleteIcon as Cancel } from "lucide-react"

interface EditablePlanSectionProps {
  content: any
  sectionType: string
  onSave: (newContent: any) => void
  onCancel: () => void
}

export function EditablePlanSection({ content, sectionType, onSave, onCancel }: EditablePlanSectionProps) {
  const [editedContent, setEditedContent] = useState(content)

  const handleSave = () => {
    onSave(editedContent)
  }

  const addArrayItem = (path: string[]) => {
    const newContent = { ...editedContent }
    let current = newContent

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    const lastKey = path[path.length - 1]
    if (!current[lastKey]) current[lastKey] = []
    current[lastKey] = [...current[lastKey], ""]

    setEditedContent(newContent)
  }

  const removeArrayItem = (path: string[], index: number) => {
    const newContent = { ...editedContent }
    let current = newContent

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    const lastKey = path[path.length - 1]
    current[lastKey] = current[lastKey].filter((_: any, i: number) => i !== index)

    setEditedContent(newContent)
  }

  const updateArrayItem = (path: string[], index: number, value: string) => {
    const newContent = { ...editedContent }
    let current = newContent

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    const lastKey = path[path.length - 1]
    current[lastKey][index] = value

    setEditedContent(newContent)
  }

  const renderEditableContent = () => {
    switch (sectionType) {
      case "summary":
        return (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter project summary..."
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                <Cancel className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            {/* MVP Features */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  MVP Features
                </Badge>
                <Button onClick={() => addArrayItem(["mvp"])} size="sm" variant="outline" className="h-6 px-2">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {editedContent.mvp?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem(["mvp"], index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeArrayItem(["mvp"], index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* High Priority Features */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  High Priority
                </Badge>
                <Button onClick={() => addArrayItem(["high"])} size="sm" variant="outline" className="h-6 px-2">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {editedContent.high?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem(["high"], index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeArrayItem(["high"], index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Features */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">Optional Features</Badge>
                <Button onClick={() => addArrayItem(["optional"])} size="sm" variant="outline" className="h-6 px-2">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {editedContent.optional?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full flex-shrink-0" />
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem(["optional"], index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeArrayItem(["optional"], index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                <Cancel className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )

      case "techStack":
        return (
          <div className="space-y-6">
            {Object.entries(editedContent).map(([category, technologies]: [string, any]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{category}</h4>
                  <Button onClick={() => addArrayItem([category])} size="sm" variant="outline" className="h-6 px-2">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {technologies.map((tech: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tech}
                        onChange={(e) => updateArrayItem([category], index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeArrayItem([category], index)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                <Cancel className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )

      default:
        if (Array.isArray(editedContent)) {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  onClick={() => setEditedContent([...editedContent, ""])}
                  size="sm"
                  variant="outline"
                  className="h-6 px-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {editedContent.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newContent = [...editedContent]
                        newContent[index] = e.target.value
                        setEditedContent(newContent)
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const newContent = editedContent.filter((_: any, i: number) => i !== index)
                        setEditedContent(newContent)
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                  <Cancel className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-4">
              <Textarea
                value={typeof editedContent === "string" ? editedContent : JSON.stringify(editedContent, null, 2)}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                  <Cancel className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )
        }
    }
  }

  return <div>{renderEditableContent()}</div>
}
