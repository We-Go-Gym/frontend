
"use client"


import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Save, X } from "lucide-react"


interface AlunoData {
  id_aluno: number
  nome_aluno: string
  email: string
  idade: number
  peso_kg: number
  altura: number
}


const initialState: AlunoData = {
  id_aluno: 0,
  nome_aluno: "",
  email: "",
  idade: 0,
  peso_kg: 0.0,
  altura: 0.0,
}

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  

  const [formData, setFormData] = useState<AlunoData>(initialState)
  

  useEffect(() => {

    const alunoId = 1
    

    async function fetchAlunoData() {
      try {

        const response = await fetch(`http://localhost:8000/Aluno/${alunoId}`)
        
        if (!response.ok) {
          throw new Error("Falha ao buscar dados do aluno")
        }
        
        const data: AlunoData = await response.json()
        

        setFormData(data)
        
      } catch (error) {
        console.error(error)

      }
    }

    fetchAlunoData()
  }, []) 

  

  const handleSave = async () => {
    const alunoId = formData.id_aluno
    
    try {
      const response = await fetch(`http://localhost:8000/Aluno/${alunoId}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nome_aluno: formData.nome_aluno,
          email: formData.email,
          idade: formData.idade,
          peso_kg: formData.peso_kg,
          altura: formData.altura,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar dados do aluno")
      }

      const updatedData: AlunoData = await response.json()
      

      setFormData(updatedData)
      setIsEditing(false)
      console.log("Perfil atualizado:", updatedData)


    } catch (error) {
      console.error(error)
      
    }
  }


  const handleCancel = () => {

    setIsEditing(false)

  }


  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }


  return (
    <div className="space-y-8">
      {/* Cabeçalho com botões  */}
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
           <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
         </div>
         <div className="flex space-x-2">
           {isEditing ? (
             <>
               <Button variant="outline" onClick={handleCancel}>
                 <X className="mr-2 h-4 w-4" />
                 Cancelar
               </Button>
               <Button onClick={handleSave}>
                 <Save className="mr-2 h-4 w-4" />
                 Salvar
               </Button>
             </>
           ) : (
             <Button onClick={() => setIsEditing(true)}>
               <Edit className="mr-2 h-4 w-4" />
               Editar Perfil
             </Button>
           )}
         </div>
       </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda - Resumo */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">{getInitials(formData.nome_aluno)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{formData.nome_aluno}</CardTitle>
              <CardDescription>{formData.email}</CardDescription>

            </CardHeader>
          </Card>

          {/* Estatísticas Físicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas Físicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idade:</span>
                <span className="font-medium">{formData.idade} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Altura:</span>
                <span className="font-medium">{formData.altura} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso atual:</span>
                <span className="font-medium">{formData.peso_kg} kg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita - Informações Detalhadas */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.nome_aluno}
                    onChange={(e) => setFormData({ ...formData, nome_aluno: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.idade}
                    onChange={(e) => setFormData({ ...formData, idade: Number.parseInt(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Informações Físicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Físicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01" 
                    value={formData.altura}
                    onChange={(e) => setFormData({ ...formData, altura: Number.parseFloat(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    value={formData.peso_kg}
                    onChange={(e) => setFormData({ ...formData, peso_kg: Number.parseFloat(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}