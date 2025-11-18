import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="relative w-full hero-gradient">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/wgg-logo.png" alt="We Go Gym" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold text-white">We Go Gym</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-white/80 hover:text-white transition-colors">
            Recursos
          </Link>
          <Link href="#about" className="text-white/80 hover:text-white transition-colors">
            Sobre
          </Link>
          <Link href="#contact" className="text-white/80 hover:text-white transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-white hover:bg-gray-100 text-gray-900 font-semibold">
            <Link href="/register">Cadastrar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
