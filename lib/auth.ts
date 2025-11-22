// Define a cara do nosso usuário (igual ao retorno da API)
export interface User {
  id: number
  email: string
  papel: "aluno" | "admin"
}

export async function getCurrentUser(): Promise<User | null> {
  // Tenta pegar o token do navegador só funciona pro lado do cliente
  if (typeof window === "undefined") return null
  
  const token = localStorage.getItem("token")
  if (!token) return null

  // Definição da URL de Autenticação (Porta 8001)
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8001"

  try {
    // Valida o token usando a variável AUTH_URL
    const response = await fetch(`${AUTH_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      // Se der erro, o token é invalido e depois descartado
      localStorage.removeItem("token")
      return null
    }

    // Retorna os dados do usuário
    return await response.json()
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return null
  }
}