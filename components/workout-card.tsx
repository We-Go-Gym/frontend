import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Target, Zap } from "lucide-react"
import Link from "next/link"

interface WorkoutCardProps {
  workout: {
    id: string
    name: string
    description: string
    duration: number
    difficulty: "Iniciante" | "Intermediário" | "Avançado"
    exercises: number
    category: string
  }
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante":
        return "bg-green-100 text-green-800"
      case "Intermediário":
        return "bg-yellow-100 text-yellow-800"
      case "Avançado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{workout.name}</CardTitle>
            <CardDescription className="mt-2">{workout.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(workout.difficulty)}>{workout.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {workout.duration} min
          </div>
          <div className="flex items-center">
            <Target className="mr-1 h-4 w-4" />
            {workout.exercises} exercícios
          </div>
          <div className="flex items-center">
            <Zap className="mr-1 h-4 w-4" />
            {workout.category}
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/student/workouts/${workout.id}`}>Ver Detalhes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
