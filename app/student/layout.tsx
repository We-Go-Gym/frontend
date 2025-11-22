"use client"

import { StudentNav } from "@/components/student-nav"
import { MobileNav } from "@/components/mobile-nav" // Importe o novo componente
import { ProtectedRoute } from "@/components/protected-route"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="aluno">
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <div className="lg:hidden">
            <MobileNav />
        </div>
        <div className="hidden lg:block w-64 border-r min-h-screen fixed left-0 top-0 bg-card z-10">
            <StudentNav />
        </div>
        <main className="flex-1 p-4 lg:p-8 lg:pl-72 w-full">
            {children}
        </main>

      </div>
    </ProtectedRoute>
  )
}