"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  status: "loading" | "authenticated" | "unauthenticated"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Check if user was previously signed in
    const savedUser = localStorage.getItem("demo-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setStatus("authenticated")
    } else {
      setStatus("unauthenticated")
    }
  }, [])

  const signIn = async () => {
    const demoUser = {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      image: "/diverse-user-avatars.png",
    }
    setUser(demoUser)
    setStatus("authenticated")
    localStorage.setItem("demo-user", JSON.stringify(demoUser))
  }

  const signOut = async () => {
    setUser(null)
    setStatus("unauthenticated")
    localStorage.removeItem("demo-user")
  }

  return <AuthContext.Provider value={{ user, signIn, signOut, status }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// For compatibility with existing code
export const useSession = () => {
  const { user, status } = useAuth()
  return {
    data: user ? { user } : null,
    status,
  }
}
