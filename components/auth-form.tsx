"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

interface AuthFormProps {
  type: "login" | "register"
}

export function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (type === "register" && formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{type === "login" ? "Entrar" : "Cadastro de Treinador"}</CardTitle>
        <CardDescription>
          {type === "login"
            ? "Entre com suas credenciais para acessar sua conta"
            : "Preencha os dados para criar sua conta de treinador"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
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
            <Label htmlFor="password">{type === "register" ? "Senha" : "Senha ou Código do Treinador"}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={type === "register" ? "Ex: MinhaSenh@123" : "Insira sua senha ou código do seu treinador"}
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
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === "login" ? "Entrar" : "Criar Conta de Treinador"}
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
