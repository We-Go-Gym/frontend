// Mock authentication utilities
export interface User {
  id: string
  name: string
  email: string
  userType: "student" | "trainer"
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    userType: "student",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    userType: "trainer",
    createdAt: new Date(),
  },
]

export async function login(email: string, password: string): Promise<User | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "treinador@gmail.com" && password === "123") {
    const trainerUser = mockUsers.find((u) => u.userType === "trainer")
    if (trainerUser) {
      // Salvar usuário no localStorage
      localStorage.setItem("currentUser", JSON.stringify(trainerUser))
      return trainerUser
    }
  }

  if (email === "aluno@gmail.com" && password === "123") {
    const studentUser = mockUsers.find((u) => u.userType === "student")
    if (studentUser) {
      // Salvar usuário no localStorage
      localStorage.setItem("currentUser", JSON.stringify(studentUser))
      return studentUser
    }
  }

  return null
}

export async function register(userData: {
  name: string
  email: string
  password: string
  userType: "student" | "trainer"
}): Promise<User> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    userType: userData.userType,
    createdAt: new Date(),
  }

  mockUsers.push(newUser)
  return newUser
}

export function logout(): void {
  localStorage.removeItem("currentUser")
  console.log("User logged out")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null // SSR check

  const storedUser = localStorage.getItem("currentUser")
  if (storedUser) {
    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  }

  return null
}
