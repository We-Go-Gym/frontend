"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Para redirecionar

interface AuthFormProps {
  type: "login" | "register"
}

export function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    weight: "",
    height: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (type === "login") {
        // Lógica pro login
        const formDataLogin = new URLSearchParams()
        formDataLogin.append("username", formData.email) // O Auth espera 'username'
        formDataLogin.append("password", formData.password)

        const response = await fetch("http://localhost:8001/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formDataLogin,
        })

        if (!response.ok) {
          throw new Error("Email ou senha incorretos")
        }

        const data = await response.json()
        // Salva o token no navegador
        localStorage.setItem("token", data.access_token)
        router.push("/student")

      } else {
        // Lógica do registro
        if (formData.password !== formData.confirmPassword) {
            throw new Error("As senhas não coincidem!")
        }

        // Criar usuário na Auth API 
        const authResponse = await fetch("http://localhost:8001/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            senha: formData.password,
            papel: "aluno",
          }),
        })

        if (!authResponse.ok) {
            const errorData = await authResponse.json()
            throw new Error(errorData.detail || "Erro ao criar usuário")
        }

        // Criar perfil na Main API 
        const mainResponse = await fetch("http://localhost:8000/Aluno/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome_aluno: formData.name,
            email: formData.email, 
            idade: parseInt(formData.age),
            peso_kg: parseFloat(formData.weight),
            altura: parseFloat(formData.height),
          }),
        })

        if (!mainResponse.ok) {
            // Se falhar aqui tem que remover na autenticação
            throw new Error("Erro ao criar perfil do aluno. Tente novamente.")
        }

        alert("Cadastro realizado com sucesso! Faça login.")
        router.push("/login")
      }
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {type === "login" ? "Entrar" : "Cadastro de Aluno"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Entre com suas credenciais para acessar sua conta"
            : "Preencha seus dados para começar sua jornada"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {type === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="70.5"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="height">Altura (m)</Label>
                    <Input
                        id="height"
                        type="number"
                        step="0.01"
                        placeholder="1.75"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        required
                    />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repetir Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === "login" ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {type === "login" ? (
            <p>
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          ) : (
            <p>
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}