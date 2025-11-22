"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Scale } from "lucide-react"

interface WeightTrackerProps {
  alunoId: number
  currentWeight: number
  currentHeight: number
  onUpdate: () => void
}

export function WeightTracker({ alunoId, currentWeight, currentHeight, onUpdate }: WeightTrackerProps) {
  const [newWeight, setNewWeight] = useState(currentWeight.toString())
  const [newHeight, setNewHeight] = useState(currentHeight.toString())
  const [isLoading, setIsLoading] = useState(false)

  // Definição da URL base
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const handleUpdateWeight = async () => {
    const weightValue = Number.parseFloat(newWeight)
    const heightValue = Number.parseFloat(newHeight)
    
    if (weightValue <= 0 || heightValue <= 0) {
      alert("Peso e Altura devem ser maiores que zero.")
      return
    }

    setIsLoading(true)
    
    try {
      // Atualiza Peso e/ou Altura usando API_URL
      const response = await fetch(`${API_URL}/Aluno/${alunoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso_kg: weightValue,
          altura: heightValue,
        }),
      })

      if (!response.ok) throw new Error("Falha ao atualizar")

      // Gera novo IMC usando API_URL
      await fetch(`${API_URL}/Imc/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_aluno: alunoId }),
      })

      // Chama o update
      onUpdate()


    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="mr-2 h-5 w-5" />
          Atualizar Medidas
        </CardTitle>
        <CardDescription>
          Atualize seu peso e altura. Um novo registro de IMC será salvo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newWeight">Peso Atual (kg)</Label>
              <Input
                id="newWeight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newHeight">Altura Atual (m)</Label>
              <Input
                id="newHeight"
                type="number"
                step="0.01"
                value={newHeight}
                onChange={(e) => setNewHeight(e.target.value)}
              />
            </div>
          </div>
           <Button onClick={handleUpdateWeight} disabled={isLoading} className="w-full">
             <Plus className="mr-2 h-4 w-4" />
             {isLoading ? "Salvando..." : "Salvar Medidas"}
           </Button>
        </div>
      </CardContent>
    </Card>
  )
}