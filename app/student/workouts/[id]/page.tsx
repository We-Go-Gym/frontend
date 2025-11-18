
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Target, Zap, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"


interface ExercicioData {
  id_exercicio: number
  nome_exercicio: string
  descricao_exercicio: string
  num_repeticoes: number
}

interface TreinoData {
  id_treino: number
  nome_treino: string
  descricao_treino: string
  categoria: string
  num_series: number
  exercicios: ExercicioData[]
}

// Busca um treino específico
async function getWorkoutDetails(id: string): Promise<TreinoData | null> {
  try {
    const response = await fetch(`http://localhost:8000/Treino/${id}`, {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Treino não encontrado")
    }
    return response.json()
  } catch (error) {
    console.error("Falha ao buscar detalhes do treino:", error)
    return null
  }
}


export default async function WorkoutDetailsPage({ params }: { params: { id: string } }) {
  

  const workout = await getWorkoutDetails(params.id)


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


  if (!workout) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Treino não encontrado</h1>
        <p className="text-muted-foreground">O treino que você está procurando não existe.</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/student/workouts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Meus Treinos
          </Link>
        </Button>
      </div>
    )
  }
  

  const workoutDetails = {
    id: workout.id_treino.toString(),
    name: workout.nome_treino,
    description: workout.descricao_treino,
    category: workout.categoria,
    exercises: workout.exercicios, 
    
    // Campos "Chumbados" 
    duration: 60, 
    difficulty: "Intermediário",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/student/workouts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Workout Info  */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{workoutDetails.name}</CardTitle>
              <CardDescription className="text-base">{workoutDetails.description}</CardDescription>
            </div>
            <Badge className={getDifficultyColor(workoutDetails.difficulty)}>
              {workoutDetails.difficulty}
            </Badge>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {workoutDetails.duration} minutos
            </div>
            <div className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              {workoutDetails.exercises.length} exercícios
            </div>
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              {workoutDetails.category}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full sm:w-auto">
            <Play className="mr-2 h-4 w-4" />
            Iniciar Treino
          </Button>
        </CardContent>
      </Card>

      {/* Exercises  */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Exercícios</h2>
        <div className="space-y-4">
          
          {workoutDetails.exercises.map((exercise, index) => (
            <Card key={exercise.id_exercicio}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {index + 1}. {exercise.nome_exercicio}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <span>{workout.num_series} séries</span>
                      <span>{exercise.num_repeticoes} repetições</span>
                      <span>Descanso: 60s</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{exercise.descricao_exercicio}</p>
                <Separator className="my-3" />
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-accent-foreground">💡 Dica:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mantenha a postura correta e foque na contração muscular.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}