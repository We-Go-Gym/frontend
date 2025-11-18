import type React from "react"
import { StudentNav } from "@/components/student-nav"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudentNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
