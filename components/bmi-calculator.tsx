"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"

interface BMIResult {
  bmi: number
  category: string
  color: string
  description: string
}

interface ImcResponse {
  id_imc: number
  valor_imc: number
  dt_calculo: string
  id_aluno: number
}

export function BMICalculator({ alunoId, onUpdate }: { alunoId: number, onUpdate: () => void }) {
  const [result, setResult] = useState<BMIResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const classifyBMI = (bmi: number): BMIResult => {
    const roundedBMI = Math.round(bmi * 10) / 10
    let category = ""
    let color = ""
    let description = ""

    if (roundedBMI < 18.5) {
      category = "Abaixo do peso"
      color = "bg-blue-100 text-blue-800"
      description = "Você está abaixo do peso ideal."
    } else if (roundedBMI < 25) {
      category = "Peso normal"
      color = "bg-green-100 text-green-800"
      description = "Parabéns! Você está dentro do peso ideal."
    } else if (roundedBMI < 30) {
      category = "Sobrepeso"
      color = "bg-yellow-100 text-yellow-800"
      description = "Você está com sobrepeso."
    } else {
      category = "Obesidade"
      color = "bg-red-100 text-red-800"
      description = "Você está com obesidade."
    }
    return { bmi: roundedBMI, category, color, description }
  }

  const handleCalculateAndSave = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch(`http://localhost:8000/Imc/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_aluno: alunoId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Falha ao calcular IMC")
      }

      const newImc: ImcResponse = await response.json()
      setResult(classifyBMI(newImc.valor_imc))
      
      // Chama o pai para recarregar os dados
      onUpdate() 

    } catch (error: any) {
      console.error(error)
      setResult({
        bmi: 0,
        category: "Erro",
        color: "bg-red-100 text-red-800",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetCalculator = () => {
    setResult(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Registrar IMC Atual
        </CardTitle>
        <CardDescription>
          Calcule e salve seu IMC com base no seu peso e altura atuais.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={handleCalculateAndSave} disabled={isLoading} className="flex-1">
            {isLoading ? "Calculando..." : "Calcular e Salvar IMC"}
          </Button>
          {result && (
            <Button variant="outline" onClick={resetCalculator}>
              Limpar
            </Button>
          )}
        </div>
        {result && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{result.bmi}</div>
              <Badge className={result.color}>{result.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">{result.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}