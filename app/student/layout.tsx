import type React from "react"
import { StudentNav } from "@/components/student-nav"
import { ProtectedRoute } from "@/components/protected-route"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="aluno">
      <div className="flex min-h-screen bg-background">
        <StudentNav />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}