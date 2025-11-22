"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, type User } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  // Ajustamos para bater com os papeis do seu banco
  requiredRole?: "aluno" | "admin" 
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Chama a função que verifica o token da API de autenticação
      const currentUser = await getCurrentUser()

      // Se não tiver usuário, chuta para o Login
      if (!currentUser) {
        router.push("/login")
        return
      }

      // Se tiver um papel exigido e o usuário não tiver, chuta para Não Autorizado
      if (requiredRole && currentUser.papel !== requiredRole) {
        router.push("/unauthorized") 
        return
      }

      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  // Enquanto verifica mostra o spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Se não tiver user mostra nada
  if (!user) {
    return null
  }

  
  return <>{children}</>
}