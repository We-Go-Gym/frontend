import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, TrendingUp, Target, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/images/wgg-logo.png"
              alt="We Go Gym"
              width={120}
              height={120}
              className="mx-auto mb-8 rounded-full shadow-2xl"
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">We Go Gym</h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90 font-medium">Train Smarter. Grow Stronger.</p>
            <p className="text-lg md:text-xl mb-12 text-white/80 max-w-2xl mx-auto text-pretty">
              A plataforma completa para gerenciar seus treinos e acompanhar sua evolução.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-lg px-8 py-4"
              >
                <Link href="/register">Começar Agora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 bg-transparent"
              >
                <Link href="#features">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Dumbbell size={60} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Target size={80} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Tudo que você precisa para <span className="text-primary">evoluir</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Uma plataforma completa para a evolução dos intusiastas em saúde.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Treinos Personalizados</h3>
                <p className="text-muted-foreground text-pretty">
                  Crie treinos individualizados com os módulos de exercíco para ter mais praticidade e eficiência.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-accent" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Acompanhamento de Progresso</h3>
                <p className="text-muted-foreground text-pretty">
                  Monitore sua evolução com gráficos detalhados de peso, IMC e performance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Praticidade</h3>
                <p className="text-muted-foreground text-pretty">
                  Toda a sua rotina de diferentes treinos reunida em um só lugar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            {/* Bloco dos Alunos  */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-balance text-center">
                Para <span className="text-accent">Atletas</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-accent mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Treinos Detalhados</h3>
                    <p className="text-muted-foreground">
                      Acesse descrições completas de cada exercício com instruções claras.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-accent mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Calculadora de IMC</h3>
                    <p className="text-muted-foreground">
                      Monitore seu índice de massa corporal e acompanhe sua evolução.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-accent mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Gráficos de Progresso</h3>
                    <p className="text-muted-foreground">
                      Visualize sua evolução de peso e performance ao longo do tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Pronto para começar sua jornada?</h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto text-pretty">
            Junte-se a milhares de pessoas que já estão transformando seus treinos com a We Go Gym.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-lg px-8 py-4"
            >
              <Link href="/register">Cadastrar Grátis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 bg-transparent"
            >
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src="/images/wgg-logo.png" alt="We Go Gym" width={32} height={32} className="rounded-full" />
              <span className="text-lg font-bold">We Go Gym</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2025 We Go Gym. Train Smarter. Grow Stronger.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
