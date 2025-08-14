"use client"

import { Badge } from "@/components/ui/badge"

interface PlanSectionProps {
  content: any
  sectionType: string
}

export function PlanSection({ content, sectionType }: PlanSectionProps) {
  const renderContent = () => {
    switch (sectionType) {
      case "summary":
        return (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{content}</p>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            {content.mvp && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    MVP Features
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {content.mvp.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.high && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    High Priority
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {content.high.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.optional && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Optional Features</Badge>
                </div>
                <ul className="space-y-2">
                  {content.optional.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "techStack":
        return (
          <div className="space-y-6">
            {Object.entries(content).map(([category, technologies]: [string, any]) => (
              <div key={category}>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 capitalize">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case "roadmap":
        return (
          <div className="space-y-6">
            {content.phases?.map((phase: any, index: number) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{phase.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{phase.description}</p>
                    {phase.tasks && (
                      <ul className="space-y-1">
                        {phase.tasks.map((task: string, taskIndex: number) => (
                          <li
                            key={taskIndex}
                            className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {index < content.phases.length - 1 && (
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 ml-4 mt-2" />
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="prose dark:prose-invert max-w-none">
            {Array.isArray(content) ? (
              <ul className="space-y-2">
                {content.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            ) : typeof content === "object" ? (
              <div className="space-y-4">
                {Object.entries(content).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{content}</p>
            )}
          </div>
        )
    }
  }

  return <div>{renderContent()}</div>
}
