import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Zap, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface WorkoutCardProps {
  workout: {
    id: string
    name: string
    description: string
    category: string
    exercises: number
    series: number
  }

  onDelete?: (id: string) => void 
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hipertrofia": return "bg-purple-100 text-purple-800"
      case "Força": return "bg-red-100 text-red-800"
      case "Cardio": return "bg-blue-100 text-blue-800"
      case "Funcional": return "bg-green-100 text-green-800"
      case "Flexibilidade": return "bg-pink-100 text-pink-800"
      case "Resistência": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="pr-8"> 
            <CardTitle className="text-xl">{workout.name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{workout.description}</CardDescription>
          </div>
          
          {/* Botão de apagar treino */}
          {onDelete && (
            <div className="absolute top-4 right-4">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* O stopPropagation evita que o clique no botão abra o link do card */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apagar Treino</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja apagar o treino "{workout.name}"? Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(workout.id)
                      }}
                    >
                      Apagar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div className="mt-2">
            <Badge className={getCategoryColor(workout.category)}>{workout.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">

          <div className="flex items-center">
            <Target className="mr-1 h-4 w-4" />
            {workout.exercises} exercícios
          </div>

          <div className="flex items-center">
            <Zap className="mr-1 h-4 w-4" />
            {workout.series} séries
          </div>

        </div>
        <Button asChild className="w-full">
          <Link href={`/student/workouts/${workout.id}`}>Ver Detalhes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}