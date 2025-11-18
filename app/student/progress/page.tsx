
import { BMICalculator } from "@/components/bmi-calculator"
import { WeightTracker } from "@/components/weight-tracker"
import { BMIProgressChart } from "@/components/bmi-progress-chart"



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


async function getProgressData(alunoId: number): Promise<AlunoData | null> {
  try {
    const response = await fetch(`http://localhost:8000/Aluno/${alunoId}`, {
      cache: "no-store", 
    })
    if (!response.ok) {
      throw new Error("Falha ao buscar dados do aluno")
    }
    return response.json()
  } catch (error) {
    console.error("Erro:", error)
    return null
  }
}


export default async function ProgressPage() {
  

  const aluno = await getProgressData(1)


  if (!aluno) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-2">Erro ao carregar dados</h1>
        <p className="text-muted-foreground">
          Não foi possível buscar os dados do aluno. Verifique se o backend está rodando.
        </p>
      </div>
    )
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
        {/* Coluna da Esquerda */}
        <div className="space-y-8">
          
          {/* Passamos o ID do aluno para a calculadora */}
          <BMICalculator alunoId={aluno.id_aluno} />
          
          {/* Passamos os dados de peso para o registrador */}
          <WeightTracker
            alunoId={aluno.id_aluno}
            currentWeight={aluno.peso_kg}
            currentHeight={aluno.altura}
          />

        </div>

        {/* Coluna da Direita */}
        <div className="space-y-8">
          

          
          {/* Passamos o histórico de IMC  para o gráfico */}
          <BMIProgressChart data={aluno.historico_imc} />
          
        </div>
      </div>
    </div>
  )
}