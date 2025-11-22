"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Target, Zap, Play, ArrowLeft, Loader2, Plus, Pencil, Search, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { toast } from "sonner"

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
  id_aluno: number
  exercicios: ExercicioData[]
}

interface WorkoutDetailsVisual {
  id: string
  name: string
  description: string
  category: string
  exercises: ExercicioData[]
  series: number
  studentId: number
}

export default function WorkoutDetailsPage() {
  const params = useParams()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [workout, setWorkout] = useState<WorkoutDetailsVisual | null>(null)

  // Definição da URL base
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Estados pros modais de edição/adição
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Estados pro modal de remoção 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [exerciseIdToDelete, setExerciseIdToDelete] = useState<number | null>(null)

  // Estados dos dados
  const [editForm, setEditForm] = useState({ name: "", description: "", category: "", series: "" })
  const [allExercises, setAllExercises] = useState<ExercicioData[]>([])
  const [exerciseSearch, setExerciseSearch] = useState("") 
  const [selectedExerciseId, setSelectedExerciseId] = useState("")

  // Busca detalhes
  const fetchWorkoutDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/login"); return }

      const response = await fetch(`${API_URL}/Treino/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      })

      if (!response.ok) throw new Error("Treino não encontrado")

      const data: TreinoData = await response.json()

      setWorkout({
        id: data.id_treino.toString(),
        name: data.nome_treino,
        description: data.descricao_treino,
        category: data.categoria,
        exercises: data.exercicios,
        series: data.num_series,
        studentId: data.id_aluno
      })

      setEditForm({
        name: data.nome_treino,
        description: data.descricao_treino,
        category: data.categoria,
        series: data.num_series.toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Busca exercícios
  const fetchAllExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/Exercicio/`, { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        setAllExercises(data)
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchWorkoutDetails()
      fetchAllExercises()
    }
  }, [params.id, router, API_URL])


  // Salva edição
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workout) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/Treino/${workout.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_treino: editForm.name,
          descricao_treino: editForm.description,
          categoria: editForm.category,
          num_series: parseInt(editForm.series),
          id_aluno: workout.studentId 
        })
      })

      if (!response.ok) throw new Error("Erro ao editar treino")

      toast.success("Treino atualizado!")
      setIsEditing(false)
      fetchWorkoutDetails() 

    } catch (error) {
      console.error(error)
      toast.error("Falha ao atualizar treino")
    }
  }

  // Adiciona exercício ao treino
  const handleAddExercise = async () => {
    if (!selectedExerciseId) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/Treino/${params.id}/exercicio/${selectedExerciseId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Erro ao adicionar")

      toast.success("Exercício adicionado!")
      setIsAdding(false)
      setSelectedExerciseId("")
      fetchWorkoutDetails() 

    } catch (error) {
      console.error(error)
      toast.error("Erro ao adicionar exercício")
    }
  }

  // Abre o modal de confirmação
  const confirmRemoveExercise = (exerciseId: number) => {
    setExerciseIdToDelete(exerciseId)
    setIsDeleteModalOpen(true)
  }

  //  Remove o exercício do treino 
  const executeRemoveExercise = async () => {
    if (!exerciseIdToDelete) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/Treino/${params.id}/exercicio/${exerciseIdToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Erro ao remover")

      toast.success("Exercício removido do treino!")
      setIsDeleteModalOpen(false) // Fecha modal
      fetchWorkoutDetails() // Atualiza lista

    } catch (error) {
      console.error(error)
      toast.error("Falha ao remover exercício")
    }
  }

  const filteredExercises = allExercises.filter(ex => 
    ex.nome_exercicio.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Hipertrofia": return "bg-purple-100 text-purple-800"
      case "Força": return "bg-red-100 text-red-800"
      case "Cardio": return "bg-blue-100 text-blue-800"
      case "Funcional": return "bg-green-100 text-green-800"
      case "Flexibilidade": return "bg-pink-100 text-pink-800"
      case "Resistência": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin"/></div>

  if (!workout) return <div>Treino não encontrado</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/student/workouts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Link>
        </Button>
      </div>
      
      {/* Card do treino */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{workout.name}</CardTitle>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Treino</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                      <div>
                        <Label>Nome</Label>
                        <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Categoria</Label>
                          <Select value={editForm.category} onValueChange={v => setEditForm({...editForm, category: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                              <SelectItem value="Força">Força</SelectItem>
                              <SelectItem value="Cardio">Cardio</SelectItem>
                              <SelectItem value="Funcional">Funcional</SelectItem>
                              <SelectItem value="Flexibilidade">Flexibilidade</SelectItem>
                              <SelectItem value="Resistência">Resistência</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Séries</Label>
                          <Input type="number" value={editForm.series} onChange={e => setEditForm({...editForm, series: e.target.value})} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Salvar Alterações</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription className="text-base">{workout.description}</CardDescription>
            </div>
            <Badge className={getCategoryColor(workout.category)}>{workout.category}</Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-4">
            <div className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              {workout.exercises.length} exercícios
            </div>
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              {workout.series} séries
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de exercícios */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Exercícios</h2>

            <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Exercício
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Exercício</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar exercício..." 
                                className="pl-8" 
                                value={exerciseSearch}
                                onChange={(e) => setExerciseSearch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Select onValueChange={setSelectedExerciseId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {filteredExercises.map((ex) => (
                                        <SelectItem key={ex.id_exercicio} value={ex.id_exercicio.toString()}>
                                            {ex.nome_exercicio}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAddExercise} className="w-full" disabled={!selectedExerciseId}>
                            Adicionar ao Treino
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Confirmação de Remoção  */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remover Exercício</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-black">
                        Tem certeza que deseja remover este exercício do treino?
                    </p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={executeRemoveExercise}>
                        Remover
                    </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>

        {workout.exercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                Nenhum exercício neste treino.
            </div>
        ) : (
            <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
                <Card key={`${exercise.id_exercicio}-${index}`}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">
                        {index + 1}. {exercise.nome_exercicio}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <span>{workout.series} séries</span>
                        <span>{exercise.num_repeticoes} repetições</span>
                        </div>
                    </div>
                    
                    {/* Botão de remover exercício */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        onClick={() => confirmRemoveExercise(exercise.id_exercicio)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-3">{exercise.descricao_exercicio}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  )
}