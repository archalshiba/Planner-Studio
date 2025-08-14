"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <div className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback>
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
              <p className="text-slate-600 dark:text-slate-400">Ready to architect your next big idea?</p>
            </div>
          </div>

          <Button asChild size="lg">
            <Link href="/">
              <Plus className="w-4 h-4 mr-2" />
              New Project Plan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
