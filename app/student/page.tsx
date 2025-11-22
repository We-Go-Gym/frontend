"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkoutCard } from "@/components/workout-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Target, Award, Loader2 } from "lucide-react"

// Interfaces 
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
  workoutsThisWeek: 0,
  totalWorkouts: 0,
  currentStreak: 0,
  nextWorkout: "A definir",
}

export default function StudentDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [aluno, setAluno] = useState<AlunoData | null>(null)
  const [treinosFormatados, setTreinosFormatados] = useState<WorkoutCardProps[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pega o Token do navegador
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login")
          return
        }

        // Chama a API Principal na rota /me Segura
        const response = await fetch("http://localhost:8000/Aluno/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token inválido
            localStorage.removeItem("token")
            router.push("/login")
            return
          }
          throw new Error("Falha ao buscar dados")
        }

        const data: AlunoData = await response.json()
        setAluno(data)

        // Traduz os treinos para o formato do Card
        const treinos = data.treinos.map((treino) => ({
          id: treino.id_treino.toString(),
          name: treino.nome_treino,
          description: treino.descricao_treino,
          category: treino.categoria,
          exercises: treino.exercicios.length,
          // Dados Mockados (visual)
          duration: 60,
          difficulty: "Intermediário" as const,
        }))
        setTreinosFormatados(treinos)

      } catch (error) {
        console.error("Erro:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!aluno) return null

  const primeiroNome = aluno.nome_aluno.split(" ")[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Olá, {primeiroNome}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta. Vamos continuar sua jornada fitness!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos esta semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treinosFormatados.length > 0 ? 1 : 0}</div>
            <p className="text-xs text-muted-foreground">Treinos ativos</p>
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

      {/* Current Workouts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
          <Badge variant="secondary">{treinosFormatados.length} treinos ativos</Badge>
        </div>

        {treinosFormatados.length === 0 ? (
           <p className="text-muted-foreground">Você ainda não tem treinos cadastrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treinosFormatados.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}