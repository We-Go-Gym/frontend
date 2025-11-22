"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BMICalculator } from "@/components/bmi-calculator"
import { WeightTracker } from "@/components/weight-tracker"
import { BMIProgressChart } from "@/components/bmi-progress-chart"
import { Loader2 } from "lucide-react"

// Interfaces
interface ImcData {
  id_imc: number
  valor_imc: number
  dt_calculo: string 
  id_aluno: number
}

interface AlunoData {
  id_aluno: number
  nome_aluno: string
  peso_kg: number
  altura: number
  historico_imc: ImcData[] 
}

export default function ProgressPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [aluno, setAluno] = useState<AlunoData | null>(null)

  // Definição da URL base
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

 
      const response = await fetch(`${API_URL}/Aluno/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
          return
        }
        throw new Error("Falha ao buscar dados")
      }

      const data: AlunoData = await response.json()
      setAluno(data)

    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router, API_URL])

  // O useEffect agora só chama a função acima
  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!aluno) {
    return <div>Erro ao carregar dados.</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">IMC & Progresso</h1>
        <p className="text-muted-foreground">
          Acompanhe sua evolução física e monitore seu progresso ao longo do tempo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          
          <BMICalculator 
            alunoId={aluno.id_aluno} 
            onUpdate={fetchData} 
          />
          
          <WeightTracker
            alunoId={aluno.id_aluno}
            currentWeight={aluno.peso_kg}
            currentHeight={aluno.altura}
            onUpdate={fetchData}
          />

        </div>

        <div className="space-y-8">
          {/* O gráfico vai atualizar sozinho quando atualizar os dados */}
          <BMIProgressChart data={aluno.historico_imc} />
        </div>
      </div>
    </div>
  )
}