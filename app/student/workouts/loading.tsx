
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


export default function WorkoutsLoading() {
  return (
    <div className="space-y-8">
      <div>
        {/* Skeleton do Cabeçalho */}
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Skeleton dos Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-48" />
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>

      {/* Skeleton da Grade de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}