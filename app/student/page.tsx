"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkoutCard } from "@/components/workout-card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Activity, TrendingUp, Weight, Loader2 } from "lucide-react" // Ícones novos

// Interfaces
interface ExercicioData {
  id_exercicio: number
}

interface TreinoData {
  id_treino: number
  nome_treino: string
  descricao_treino: string
  categoria: string
  num_series: number
  exercicios: ExercicioData[]
}

interface ImcData {
  valor_imc: number
}

interface AlunoData {
  id_aluno: number
  nome_aluno: string
  peso_kg: number
  treinos: TreinoData[]
  historico_imc: ImcData[]
}

interface WorkoutCardProps {
  id: string
  name: string
  description: string
  category: string
  exercises: number
  series: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [aluno, setAluno] = useState<AlunoData | null>(null)
  const [treinosFormatados, setTreinosFormatados] = useState<WorkoutCardProps[]>([])
  
  // Definição da URL base 
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Estado para as estatísticas reais
  const [stats, setStats] = useState({
    totalTreinos: 0,
    totalExercicios: 0,
    imcAtual: "0.0",
    pesoAtual: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pega o Token do navegador
        const token = localStorage.getItem("token")
        if (!token) { router.push("/login"); return }
        
        const response = await fetch(`${API_URL}/Aluno/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token inválido
            localStorage.removeItem("token")
            router.push("/login")
            return
          }
          throw new Error("Erro ao buscar dados")
        }

        const data: AlunoData = await response.json()
        setAluno(data)

        // treino mais novo primeiro
        const treinosOrdenados = data.treinos.sort((a, b) => b.id_treino - a.id_treino)

        const treinos = treinosOrdenados.map((treino) => ({
          id: treino.id_treino.toString(),
          name: treino.nome_treino,
          description: treino.descricao_treino,
          category: treino.categoria,
          exercises: treino.exercicios.length,
          series: treino.num_series,
        }))
        setTreinosFormatados(treinos)

        const totalEx = data.treinos.reduce((acc, curr) => acc + curr.exercicios.length, 0)
        const ultimoImc = data.historico_imc.length > 0 
            ? data.historico_imc[data.historico_imc.length - 1].valor_imc.toFixed(1) 
            : "--"

        setStats({
            totalTreinos: data.treinos.length,
            totalExercicios: totalEx,
            imcAtual: ultimoImc,
            pesoAtual: data.peso_kg
        })

      } catch (error) {
        console.error("Erro:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, API_URL]) 

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin"/></div>
  if (!aluno) return null

  const primeiroNome = aluno.nome_aluno.split(" ")[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Olá, {primeiroNome}!</h1>
        <p className="text-muted-foreground">Bem-vindo de volta. Aqui está o resumo do seu progresso.</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTreinos}</div>
            <p className="text-xs text-muted-foreground">Criados por você</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercícios Totais</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercicios}</div>
            <p className="text-xs text-muted-foreground">Em todos os seus treinos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seu IMC Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.imcAtual}</div>
            <p className="text-xs text-muted-foreground">Calculado recentemente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pesoAtual} kg</div>
            <p className="text-xs text-muted-foreground">Última medição</p>
          </CardContent>
        </Card>

      </div>

      {/* Lista de treinos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
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