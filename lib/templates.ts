import type { ProjectTemplate, TemplateCategory } from "@/types/template"

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "web-app-saas",
    name: "SaaS Web Application",
    description: "A subscription-based software service with user management, billing, and core features",
    category: "Web Application",
    icon: "🌐",
    tags: ["SaaS", "Subscription", "Web App", "Dashboard"],
    prompts: {
      context:
        "This is a SaaS (Software as a Service) web application that will serve multiple users with subscription-based access.",
      constraints: [
        "User authentication required",
        "Subscription billing system",
        "Multi-tenant architecture",
        "Responsive web design",
      ],
      focusAreas: [
        "User onboarding",
        "Subscription management",
        "Core feature delivery",
        "Analytics dashboard",
        "Customer support",
      ],
    },
    defaultSections: ["features", "techStack", "architecture", "security", "monetization", "roadmap"],
    estimatedComplexity: "Complex",
    estimatedTimeframe: "6-12 months",
  },
  {
    id: "mobile-app-native",
    name: "Native Mobile App",
    description: "A mobile application for iOS and Android with native performance and platform features",
    category: "Mobile App",
    icon: "📱",
    tags: ["Mobile", "iOS", "Android", "Native"],
    prompts: {
      context: "This is a native mobile application designed for both iOS and Android platforms.",
      constraints: ["Native mobile development", "App store compliance", "Mobile-first UX", "Offline functionality"],
      focusAreas: [
        "Mobile UX/UI",
        "Performance optimization",
        "App store optimization",
        "Push notifications",
        "Device integration",
      ],
    },
    defaultSections: ["features", "techStack", "platforms", "userExperience", "monetization", "roadmap"],
    estimatedComplexity: "Medium",
    estimatedTimeframe: "4-8 months",
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "An online store with product catalog, shopping cart, and payment processing",
    category: "E-commerce",
    icon: "🛒",
    tags: ["E-commerce", "Online Store", "Payments", "Inventory"],
    prompts: {
      context:
        "This is an e-commerce platform for selling products online with full shopping and payment capabilities.",
      constraints: ["Payment processing integration", "Inventory management", "Order fulfillment", "SEO optimization"],
      focusAreas: [
        "Product catalog",
        "Shopping experience",
        "Payment security",
        "Order management",
        "Customer service",
      ],
    },
    defaultSections: ["features", "techStack", "payments", "inventory", "marketing", "roadmap"],
    estimatedComplexity: "Complex",
    estimatedTimeframe: "4-10 months",
  },
  {
    id: "api-backend",
    name: "REST API Backend",
    description: "A scalable backend API service with database integration and authentication",
    category: "API/Backend",
    icon: "⚡",
    tags: ["API", "Backend", "Database", "Microservices"],
    prompts: {
      context: "This is a backend API service that will provide data and functionality to client applications.",
      constraints: [
        "RESTful API design",
        "Database integration",
        "Authentication/authorization",
        "Scalable architecture",
      ],
      focusAreas: ["API design", "Database schema", "Performance optimization", "Security", "Documentation"],
    },
    defaultSections: ["features", "techStack", "architecture", "database", "security", "roadmap"],
    estimatedComplexity: "Medium",
    estimatedTimeframe: "3-6 months",
  },
  {
    id: "content-cms",
    name: "Content Management System",
    description: "A CMS for managing and publishing content with admin interface and public site",
    category: "Content Management",
    icon: "📝",
    tags: ["CMS", "Content", "Publishing", "Admin"],
    prompts: {
      context: "This is a content management system for creating, managing, and publishing content online.",
      constraints: ["Content editor interface", "User role management", "SEO optimization", "Media management"],
      focusAreas: ["Content creation", "Publishing workflow", "User management", "SEO features", "Performance"],
    },
    defaultSections: ["features", "techStack", "contentModel", "userRoles", "seo", "roadmap"],
    estimatedComplexity: "Medium",
    estimatedTimeframe: "3-7 months",
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    description: "A data visualization dashboard with charts, reports, and real-time analytics",
    category: "Analytics/Data",
    icon: "📊",
    tags: ["Analytics", "Dashboard", "Data Viz", "Reports"],
    prompts: {
      context:
        "This is an analytics dashboard for visualizing data and generating insights through charts and reports.",
      constraints: [
        "Real-time data processing",
        "Interactive visualizations",
        "Export capabilities",
        "Performance optimization",
      ],
      focusAreas: ["Data visualization", "Real-time updates", "Report generation", "User experience", "Data security"],
    },
    defaultSections: ["features", "techStack", "dataModel", "visualizations", "performance", "roadmap"],
    estimatedComplexity: "Complex",
    estimatedTimeframe: "4-8 months",
  },
]

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Web Application",
  "Mobile App",
  "Desktop Software",
  "API/Backend",
  "E-commerce",
  "Content Management",
  "Analytics/Data",
  "Gaming",
  "IoT/Hardware",
  "AI/ML",
]

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((template) => template.id === id)
}

export function getProjectTemplateById(id: string): ProjectTemplate | undefined {
  return getTemplateById(id)
}

export function getTemplatesByCategory(category: TemplateCategory): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter((template) => template.category === category)
}

export function searchTemplates(query: string): ProjectTemplate[] {
  const lowercaseQuery = query.toLowerCase()
  return PROJECT_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
