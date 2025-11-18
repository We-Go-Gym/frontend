
import { WorkoutCard } from "@/components/workout-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"


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


async function getStudentWorkouts(
  alunoId: number,
): Promise<WorkoutCardProps[]> {
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
        duration: 60, // Valor "chumbado"
        difficulty: "Intermediário", // Valor "chumbado"
      }
    })

    return treinosFormatados
  } catch (error) {
    console.error("Erro ao buscar dados dos treinos:", error)
    return []
  }
}

//  A página agora é 'async'
export default async function WorkoutsPage() {
  
  //  Buscamos os dados REAIS
  const workouts = await getStudentWorkouts(1) // "Chumbado" Aluno ID 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meus Treinos</h1>
        <p className="text-muted-foreground">Todos os seus treinos organizados em um só lugar.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar treinos..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="forca">Força</SelectItem>
            <SelectItem value="funcional">Funcional</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*  dados reais 'workouts' */}
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  )
}