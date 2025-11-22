"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Dumbbell, Calculator, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Início", href: "/student", icon: Home },
  { name: "Meus Treinos", href: "/student/workouts", icon: Dumbbell },
  { name: "IMC & Progresso", href: "/student/progress", icon: Calculator },
  { name: "Perfil", href: "/student/profile", icon: User },
]

export function StudentNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (

    <nav className="flex flex-col h-full p-6 bg-card">
      <div className="flex items-center space-x-2 mb-8">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
             <span className="font-bold text-xs">WGG</span> 
             <Image src="/images/wgg-logo.png" alt="Logo" fill className="object-cover" /> 
        </div>
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

      <div className="mt-auto pt-6">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </nav>
  )
}
