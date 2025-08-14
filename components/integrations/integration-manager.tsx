"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { AVAILABLE_INTEGRATIONS, getIntegrationsByCategory } from "@/lib/integrations"
import type { ExternalIntegration } from "@/types/integrations"
import { useToast } from "@/hooks/use-toast"

interface IntegrationManagerProps {
  onIntegrationConnect?: (integration: ExternalIntegration) => void
}

export function IntegrationManager({ onIntegrationConnect }: IntegrationManagerProps) {
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null)
  const [configValues, setConfigValues] = useState<Record<string, string>>({})
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const categories = ["Project Management", "Development", "Communication", "Documentation"]

  const handleConnect = async (integration: ExternalIntegration) => {
    setIsConnecting(true)

    try {
      // Simulate API call to connect integration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setConnectedIntegrations((prev) => new Set([...prev, integration.id]))
      setSelectedIntegration(null)
      setConfigValues({})

      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${integration.name}`,
      })

      onIntegrationConnect?.(integration)
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${integration.name}. Please check your credentials.`,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    setConnectedIntegrations((prev) => {
      const newSet = new Set(prev)
      newSet.delete(integrationId)
      return newSet
    })

    toast({
      title: "Integration Disconnected",
      description: "Integration has been disconnected successfully",
    })
  }

  const IntegrationCard = ({ integration }: { integration: ExternalIntegration }) => {
    const isConnected = connectedIntegrations.has(integration.id)

    return (
      <Card className={`cursor-pointer transition-all hover:shadow-md ${isConnected ? "ring-2 ring-green-500" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{integration.icon}</span>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {integration.name}
                  {isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
                </CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  {integration.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm mb-3">{integration.description}</CardDescription>

          <div className="flex flex-wrap gap-1 mb-3">
            {integration.supportedExports.map((exportType) => (
              <Badge key={exportType} variant="outline" className="text-xs">
                {exportType}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            {isConnected ? (
              <>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDisconnect(integration.id)}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1" onClick={() => setSelectedIntegration(integration)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-xl">{integration.icon}</span>
                      Connect to {integration.name}
                    </DialogTitle>
                    <DialogDescription>{integration.description}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {integration.configFields?.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type === "password" ? "password" : "text"}
                          placeholder={field.placeholder}
                          value={configValues[field.key] || ""}
                          onChange={(e) =>
                            setConfigValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your credentials are encrypted and stored securely. We never share your data with third parties.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                      <Button onClick={() => handleConnect(integration)} disabled={isConnecting} className="flex-1">
                        {isConnecting ? "Connecting..." : "Connect"}
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">External Integrations</h2>
        <p className="text-muted-foreground mt-2">Connect your favorite tools to export and sync your project plans</p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getIntegrationsByCategory(category).map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {connectedIntegrations.size > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Connected Integrations</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(connectedIntegrations).map((integrationId) => {
              const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)
              return integration ? (
                <Badge key={integrationId} variant="secondary" className="flex items-center gap-1">
                  <span>{integration.icon}</span>
                  {integration.name}
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </Badge>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
