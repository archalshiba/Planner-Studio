import type { ExternalIntegration } from "@/types/integrations"

export const AVAILABLE_INTEGRATIONS: ExternalIntegration[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Export project plans as Jira epics and stories",
    icon: "🔷",
    category: "Project Management",
    isConnected: false,
    requiresAuth: true,
    supportedExports: ["tasks", "issues"],
    configFields: [
      {
        key: "domain",
        label: "Jira Domain",
        type: "url",
        required: true,
        placeholder: "https://yourcompany.atlassian.net",
      },
      {
        key: "email",
        label: "Email",
        type: "text",
        required: true,
        placeholder: "your-email@company.com",
      },
      {
        key: "apiToken",
        label: "API Token",
        type: "password",
        required: true,
        placeholder: "Your Jira API token",
      },
      {
        key: "projectKey",
        label: "Project Key",
        type: "text",
        required: true,
        placeholder: "PROJ",
      },
    ],
  },
  {
    id: "trello",
    name: "Trello",
    description: "Create Trello boards with cards for each project phase",
    icon: "📋",
    category: "Project Management",
    isConnected: false,
    requiresAuth: true,
    supportedExports: ["tasks", "roadmap"],
    configFields: [
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "Your Trello API key",
      },
      {
        key: "token",
        label: "Token",
        type: "password",
        required: true,
        placeholder: "Your Trello token",
      },
      {
        key: "boardId",
        label: "Board ID",
        type: "text",
        required: false,
        placeholder: "Leave empty to create new board",
      },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Create GitHub repository with issues and project board",
    icon: "🐙",
    category: "Development",
    isConnected: false,
    requiresAuth: true,
    supportedExports: ["repository", "issues", "roadmap"],
    configFields: [
      {
        key: "token",
        label: "Personal Access Token",
        type: "password",
        required: true,
        placeholder: "ghp_xxxxxxxxxxxx",
      },
      {
        key: "owner",
        label: "Repository Owner",
        type: "text",
        required: true,
        placeholder: "username or organization",
      },
      {
        key: "repo",
        label: "Repository Name",
        type: "text",
        required: false,
        placeholder: "Leave empty to create new repo",
      },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Export project plan as structured Notion pages",
    icon: "📝",
    category: "Documentation",
    isConnected: false,
    requiresAuth: true,
    supportedExports: ["documentation", "tasks"],
    configFields: [
      {
        key: "token",
        label: "Integration Token",
        type: "password",
        required: true,
        placeholder: "secret_xxxxxxxxxxxx",
      },
      {
        key: "databaseId",
        label: "Database ID",
        type: "text",
        required: false,
        placeholder: "Leave empty to create new database",
      },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Share project plan summary in Slack channels",
    icon: "💬",
    category: "Communication",
    isConnected: false,
    requiresAuth: true,
    supportedExports: ["roadmap"],
    configFields: [
      {
        key: "webhookUrl",
        label: "Webhook URL",
        type: "url",
        required: true,
        placeholder: "https://hooks.slack.com/services/...",
      },
      {
        key: "channel",
        label: "Channel",
        type: "text",
        required: true,
        placeholder: "#general",
      },
    ],
  },
]

export function getIntegrationById(id: string): ExternalIntegration | undefined {
  return AVAILABLE_INTEGRATIONS.find((integration) => integration.id === id)
}

export function getIntegrationsByCategory(category: string): ExternalIntegration[] {
  return AVAILABLE_INTEGRATIONS.filter((integration) => integration.category === category)
}
