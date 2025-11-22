"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { StudentNav } from "@/components/student-nav"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    // Barra só para telas pequenas
    <header className="flex h-16 items-center border-b bg-background px-6 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        
        {/* Menu lateral */}
        <SheetContent side="left" className="p-0 w-72">
            <div className="h-full" onClick={() => setOpen(false)}>
                <StudentNav />
            </div>
        </SheetContent>
      </Sheet>
      
      <div className="ml-4 font-semibold text-lg">We Go Gym</div>
    </header>
  )
}