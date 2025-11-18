"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCurrentUser, type User } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: "student" | "trainer"
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        router.push("/login")
        return
      }

      if (requiredUserType && currentUser.userType !== requiredUserType) {
        router.push("/login")
        return
      }

      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredUserType])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
