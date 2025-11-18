"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Users, Dumbbell, Plus, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/trainer", icon: Home },
  { name: "Meus Alunos", href: "/trainer/students", icon: Users },
  { name: "Criar Treino", href: "/trainer/workouts/create", icon: Plus },
  { name: "Biblioteca de Treinos", href: "/trainer/workouts", icon: Dumbbell },
  { name: "Perfil", href: "/trainer/profile", icon: User },
]

export function TrainerNav() {
  const pathname = usePathname()

  const handleLogout = () => {
    console.log("Logging out...")
    window.location.href = "/login"
  }

  return (
    <nav className="bg-card border-r min-h-screen w-64 p-6 flex flex-col">
      <div className="flex items-center space-x-2 mb-8">
        <Image src="/images/wgg-logo.png" alt="We Go Gym" width={32} height={32} className="rounded-full" />
        <span className="text-lg font-bold">We Go Gym</span>
      </div>

      <div className="space-y-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </nav>
  )
}
