
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkoutCard } from "@/components/workout-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Target, Award } from "lucide-react"


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

interface AlunoData {
  id_aluno: number
  nome_aluno: string
  treinos: TreinoData[] 
}


interface WorkoutCardProps {
  id: string
  name: string
  description: string
  duration: number
  difficulty: "Iniciante" | "Intermediário" | "Avançado"
  exercises: number 
  category: string
}


const mockStats = {
  workoutsThisWeek: 4,
  totalWorkouts: 28,
  currentStreak: 7,
  nextWorkout: "Treino de Costas e Bíceps",
}


async function getStudentDashboardData(
  alunoId: number,
): Promise<{ aluno: AlunoData | null; treinosFormatados: WorkoutCardProps[] }> {
  try {

    const response = await fetch(`http://localhost:8000/Aluno/${alunoId}`, {
      cache: "no-store", 
    })

    if (!response.ok) {
      throw new Error("Falha ao buscar dados do Aluno")
    }

    const aluno: AlunoData = await response.json()


    const treinosFormatados: WorkoutCardProps[] = aluno.treinos.map((treino) => {
      return {
        id: treino.id_treino.toString(),
        name: treino.nome_treino,
        description: treino.descricao_treino,
        category: treino.categoria,


        exercises: treino.exercicios.length,


        duration: 60,
        difficulty: "Intermediário", 
      }
    })

    return { aluno, treinosFormatados }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)

    return { aluno: null, treinosFormatados: [] }
  }
}


export default async function StudentDashboard() {
  

  const { aluno, treinosFormatados } = await getStudentDashboardData(1)


  const primeiroNome = aluno ? aluno.nome_aluno.split(" ")[0] : "Aluno"

  return (
    <div className="space-y-8">
      <div>
        {}
        <h1 className="text-3xl font-bold mb-2">Olá, {primeiroNome}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta. Vamos continuar sua jornada fitness!
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos esta semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.workoutsThisWeek}</div>
            <p className="text-xs text-muted-foreground">+2 desde a semana passada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de treinos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">Desde o início</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência atual</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo treino</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{mockStats.nextWorkout}</div>
            <p className="text-xs text-muted-foreground">Agendado para hoje</p>
          </CardContent>
        </Card>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
          {}
          <Badge variant="secondary">{treinosFormatados.length} treinos ativos</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          {treinosFormatados.map((workout) => (
            
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  )
}