"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface ImcData {
  id_imc: number
  valor_imc: number
  dt_calculo: string
  id_aluno: number
}

export function BMIProgressChart({ data }: { data: ImcData[] }) {
  
  // filtragem pra pegar o últmio imc calculado no dia
  const uniqueDataMap = new Map();
  
  data.forEach(entry => {
    const dateKey = new Date(entry.dt_calculo + "T00:00:00").toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
    });
    // O Map sobrescreve pra sempre sobrar o último registro do dia
    uniqueDataMap.set(dateKey, entry.valor_imc);
  });

  // Transforma o Map para array pro gráfico
  const formattedData = Array.from(uniqueDataMap, ([date, bmi]) => ({ date, bmi }));

  const currentBMI = data.length > 0 ? data[data.length - 1].valor_imc : 0

  const getBMICategory = (bmi: number) => {
    if (bmi === 0) return { category: "--", color: "text-gray-500" }
    if (bmi < 18.5) return { category: "Abaixo do peso", color: "text-blue-600" }
    if (bmi < 25) return { category: "Peso normal", color: "text-green-600" }
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-600" }
    return { category: "Obesidade", color: "text-red-600" }
  }

  const { category, color } = getBMICategory(currentBMI)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do IMC</CardTitle>
        <CardDescription>Acompanhe a evolução do seu Índice de Massa Corporal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-3xl font-bold">
            {currentBMI > 0 ? currentBMI.toFixed(2) : "--"}
          </div>
          <div className={`text-sm font-medium ${color}`}>{category}</div>
        </div>

        {/* O Gráfico */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {formattedData.length === 0 ? (
               <div className="flex h-full items-center justify-center text-muted-foreground text-sm">

               </div>
            ) : (
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                {/* 'auto' faz o gráfico se adaptar a qualquer valor */}
                <YAxis domain={['auto', 'auto']} />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => [value.toFixed(2), "IMC"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />

                <ReferenceLine y={18.5} stroke="#3b82f6" strokeDasharray="2 2" />
                <ReferenceLine y={25} stroke="#eab308" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="2 2" />

                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2 text-xs">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
               <span>Abaixo do peso ({"< 18.5"})</span>
             </div>
           </div>
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <div className="w-3 h-0.5 bg-green-500 mr-2"></div>
               <span>Peso normal (18.5 - 24.9)</span>
             </div>
           </div>
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <div className="w-3 h-0.5 bg-yellow-500 mr-2"></div>
               <span>Sobrepeso (25.0 - 29.9)</span>
             </div>
           </div>
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
               <span>Obesidade ({"≥ 30.0"})</span>
             </div>
           </div>
         </div>
      </CardContent>
    </Card>
  )
}