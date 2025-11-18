import { AuthForm } from "@/components/auth-form"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Image src="/images/wgg-logo.png" alt="We Go Gym" width={48} height={48} className="rounded-full" />
            <span className="text-2xl font-bold text-white">We Go Gym</span>
          </Link>
          <p className="text-white/80 text-lg">Train Smarter. Grow Stronger.</p>
        </div>

        <AuthForm type="login" />

        <div className="mt-6 text-center">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
