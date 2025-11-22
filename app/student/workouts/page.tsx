"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WorkoutCard } from "@/components/workout-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

// Interfaces 
interface WorkoutCardProps {
  id: string
  name: string
  description: string
  category: string
  exercises: number
  series: number
}

interface AlunoData {
  id_aluno: number
  treinos: any[]
}

export default function WorkoutsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState<WorkoutCardProps[]>([])
  const [alunoId, setAlunoId] = useState<number | null>(null)

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Estados de Criação
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    nome: "",
    descricao: "",
    categoria: "Hipertrofia",
    num_series: "3"
  })

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/login"); return }

      const response = await fetch("http://localhost:8000/Aluno/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })

      if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/login")
            return
        }
        throw new Error("Erro ao buscar dados")
      }

      const data: AlunoData = await response.json()
      setAlunoId(data.id_aluno)

      // Treinos mais novos apareçem primeiro
      const treinosOrdenados = data.treinos.sort((a, b) => b.id_treino - a.id_treino)

      const formattedWorkouts = treinosOrdenados.map((treino: any) => ({
        id: treino.id_treino.toString(),
        name: treino.nome_treino,
        description: treino.descricao_treino,
        category: treino.categoria,
        exercises: treino.exercicios.length,
        series: treino.num_series,
      }))

      setWorkouts(formattedWorkouts)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar treinos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [router])

  // Apagar um treino
  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/Treino/${workoutId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Erro ao apagar")

      toast.success("Treino apagado com sucesso")
      // Recarrega a lista para sumir com o treino apagado
      fetchWorkouts() 

    } catch (error) {
      console.error(error)
      toast.error("Erro ao apagar treino")
    }
  }

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alunoId) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/Treino/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_treino: newWorkout.nome,
          descricao_treino: newWorkout.descricao,
          categoria: newWorkout.categoria,
          num_series: parseInt(newWorkout.num_series),
          id_aluno: alunoId
        })
      })

      if (!response.ok) throw new Error("Falha ao criar treino")

      toast.success("Treino criado com sucesso!")
      setIsCreating(false)
      setNewWorkout({ nome: "", descricao: "", categoria: "Hipertrofia", num_series: "3" })
      fetchWorkouts()

    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar treino")
    }
  }

  // Filtro pelo nome e/ou categoria
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || workout.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Treinos</h1>
          <p className="text-muted-foreground">Gerencie seus treinos.</p>
        </div>
        
        {/* Modal de Criação */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Novo Treino</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Treino</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateWorkout} className="space-y-4 pt-4">
                    <div>
                        <Label>Nome do Treino</Label>
                        <Input 
                            placeholder="Ex: Treino A - Peito" 
                            value={newWorkout.nome}
                            onChange={e => setNewWorkout({...newWorkout, nome: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <Label>Descrição</Label>
                        <Input 
                            placeholder="Foco em força..." 
                            value={newWorkout.descricao}
                            onChange={e => setNewWorkout({...newWorkout, descricao: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Categoria</Label>
                            <Select 
                                value={newWorkout.categoria} 
                                onValueChange={v => setNewWorkout({...newWorkout, categoria: v})}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {/* Categorias */}
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
                            <Label>Séries Padrão</Label>
                            <Input 
                                type="number" 
                                value={newWorkout.num_series}
                                onChange={e => setNewWorkout({...newWorkout, num_series: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Salvar</Button>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
              placeholder="Buscar treinos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
            <SelectItem value="Cardio">Cardio</SelectItem>
            <SelectItem value="Força">Força</SelectItem>
            <SelectItem value="Funcional">Funcional</SelectItem>
            <SelectItem value="Funcional">Flexibilidade</SelectItem>
            <SelectItem value="Funcional">Resistência</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Treinos */}
      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {searchTerm || categoryFilter !== "all" ? "Nenhum treino encontrado para os filtros." : "Você ainda não possui treinos cadastrados."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Delete passado pro card */}
          {filteredWorkouts.map((workout) => (
            <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onDelete={handleDeleteWorkout} 
            />
          ))}
        </div>
      )}
    </div>
  )
}