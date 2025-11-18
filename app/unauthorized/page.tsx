import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Acesso Negado</CardTitle>
          <CardDescription className="text-gray-600">Você não tem permissão para acessar esta página.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Esta área é restrita. Entre em contato com o administrador se você acredita que deveria ter acesso.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Fazer Login</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
