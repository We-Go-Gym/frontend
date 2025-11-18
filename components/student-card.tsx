import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

interface StudentCardProps {
  student: {
    id: string
    name: string
    email: string
    avatar?: string
    joinDate: string
    workoutsCompleted: number
    currentGoal: string
    status: "Ativo" | "Inativo"
    lastWorkout: string
  }
}

export function StudentCard({ student }: StudentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={student.avatar || "/placeholder.svg"} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <CardDescription>{student.email}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Membro desde
            </div>
            <span>{student.joinDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Treinos concluídos
            </div>
            <span>{student.workoutsCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Objetivo atual
            </div>
            <span>{student.currentGoal}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/trainer/students/${student.id}`}>Ver Perfil</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href={`/trainer/students/${student.id}/assign-workout`}>Atribuir Treino</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
