import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Clock, MapPin, Leaf, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import Marquee from "@/components/Marquee";
import { useEffect, useState } from 'react'




export default function HomePage() {
  const [stats, setStats] = useState<{
  meseSalvate: number
  restaurante: number
  reducereMedie: number
  co2Economisit: string
} | null>(null)

useEffect(() => {
  fetch('/api/statistici')
    .then((res) => res.json())
    .then(setStats)
    .catch(() => setStats(null))
}, [])

  const items = [
  "SALATE", "PRĂJITURI", "SUPE", "BURGERI",
  "SANDVIȘURI", "PIZZA", "PASTE", "SUSHI"
];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
    
      {/* Hero Section */}
      <section
  className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/legume.png')",
  }}
>
  <div className="relative max-w-7xl mx-auto text-center">
    <div className="inline-block bg-white/80 backdrop-blur-[1px] rounded-3xl px-8 py-10 text-center mx-auto">


      <div className="mb-8">
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-6">
          <Leaf className="w-3 h-3 mr-1" />
          Sustenabilitate & Economie
        </Badge>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Salvează mâncarea.
        </span>
        <br />
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Evită risipa alimentară.
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
        Descoperă produse delicioase de la restaurante locale aproape de expirare – la prețuri reduse. Reduci risipa alimentară și susții sustenabilitatea.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
    asChild
    size="lg"
    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <Link href="/produse-publice">
      <ShoppingBag className="w-5 h-5 mr-2" />
      Descoperă Oferte
      <ArrowRight className="w-4 h-4 ml-2" />
    </Link>
  </Button>

  <Button
    asChild
    variant="outline"
    size="lg"
    className="border-2 border-green-200 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl"
  >
    <Link href="/restaurante">
      <MapPin className="w-5 h-5 mr-2" />
      Vezi Restaurante
    </Link>
  </Button>
      </div>
    </div>
  </div>
</section>


{/* Marquee Interactiv */}
  <Marquee items={items} />

     {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Descoperă oferte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Găsește mâncare delicioasă la prețuri reduse de la restaurante locale din zona ta.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Rezervă rapid</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Rezervă produsele preferate înainte să fie prea târziu și asigură-ți mâncarea.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">Ridică local</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Ridică comanda de la restaurant în intervalul specificat și bucură-te de mâncare.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {stats ? `${stats.meseSalvate}+` : '...'}
        </div>
        <div className="text-green-100">Mese salvate</div>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {stats ? `${stats.restaurante}+` : '...'}
        </div>
        <div className="text-green-100">Restaurante partenere</div>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {stats ? `${stats.reducereMedie}%` : '...'}
        </div>
        <div className="text-green-100">Reducere medie</div>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {stats ? `${stats.co2Economisit}T` : '...'}
        </div>
        <div className="text-green-100">CO₂ economisit</div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Gata să începi să salvezi mâncarea?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Alătură-te comunității noastre și fă o diferență pentru planetă, o mâncare la un timp.
          </p>
          <Link href="/produse-publice" className="block w-fit mx-auto">
  <Button
    size="lg"
    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <Star className="w-5 h-5" />
    <span className="font-semibold">Începe acum</span>
  </Button>
</Link>


        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LastBite</span>
            </div>
            <div className="text-gray-400 text-sm">©LastBite. Toate drepturile rezervate.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
