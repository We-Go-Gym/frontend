"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dumbbell, Plus, Pencil, Trash2, Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/protected-route"

// Interface do Exercício 
interface ExercicioData {
  id_exercicio: number
  nome_exercicio: string
  descricao_exercicio: string
  num_repeticoes: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<ExercicioData[]>([])
  
  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estado do Formulário
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    repeticoes: ""
  })

  // Busca exercícios
  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/Exercicio/", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      })
      
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar exercícios")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  const openModal = (exercise?: ExercicioData) => {
    if (exercise) {
      setIsEditing(true)
      setCurrentId(exercise.id_exercicio)
      setFormData({
        nome: exercise.nome_exercicio,
        descricao: exercise.descricao_exercicio,
        repeticoes: exercise.num_repeticoes.toString()
      })
    } else {
      setIsEditing(false)
      setCurrentId(null)
      setFormData({ nome: "", descricao: "", repeticoes: "" })
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    
    try {
      const url = isEditing 
        ? `http://localhost:8000/Exercicio/${currentId}` 
        : `http://localhost:8000/Exercicio/`            
      
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_exercicio: formData.nome,
          descricao_exercicio: formData.descricao,
          num_repeticoes: parseInt(formData.repeticoes)
        })
      })

      if (!response.ok) throw new Error("Erro ao salvar")

      toast.success(isEditing ? "Exercício atualizado!" : "Exercício criado!")
      setIsModalOpen(false)
      fetchExercises() 

    } catch (error) {
      console.error(error)
      toast.error("Falha na operação")
    }
  }

  // Deleta um exercício
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar este exercício?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/Exercicio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Erro ao apagar")

      toast.success("Exercício removido!")
      fetchExercises()

    } catch (error) {
      console.error(error)
      toast.error("Erro ao apagar exercício")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-muted/10 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Painel do Administrador</h1>
              <p className="text-muted-foreground">Gerencie o catálogo de exercícios da academia.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>

          <div className="flex justify-end">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openModal()} className="bg-primary text-white">
                  <Plus className="mr-2 h-4 w-4" /> Novo Exercício
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Editar Exercício" : "Criar Novo Exercício"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input 
                      value={formData.nome} 
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Supino Reto"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea 
                      value={formData.descricao} 
                      onChange={e => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Instruções de execução..."
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Repetições</Label>
                    <Input 
                      type="number"
                      value={formData.repeticoes} 
                      onChange={e => setFormData({...formData, repeticoes: e.target.value})}
                      placeholder="Ex:10"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isEditing ? "Salvar Alterações" : "Criar Exercício"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Exercícios */}
          {isLoading ? (
             <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((ex) => (
                <Card key={ex.id_exercicio} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{ex.nome_exercicio}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openModal(ex)}
                            className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>


                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(ex.id_exercicio)}
                            className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {ex.descricao_exercicio}
                    </CardDescription>
                    <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                      <span>Número de Repetições:</span>
                      <span className="font-medium text-foreground">{ex.num_repeticoes}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
