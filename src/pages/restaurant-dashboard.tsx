import { useEffect, useState, useRef  } from 'react'
import { useRouter } from 'next/router'
import { getUser } from '../lib/authClient'
import { Button } from '@/components/ui/button'
import { PlusCircle, ListOrdered, ClipboardList, Star, User, Utensils, Leaf } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type Recenzie = {
  IdRecenzie: number
  MesajClient: string
  Rating: number
  DataRecenzie: string
  RaspunsRestaurant: string | null
  NumeClient: string
  IdComanda: number
}

type User = {
  id: number
  email: string
  tip: 'restaurant' | 'client'
}

export default function RestaurantDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [recenzii, setRecenzii] = useState<Recenzie[]>([])
  const [raspunsuri, setRaspunsuri] = useState<{ [key: number]: string }>({})
const router = useRouter()
const recenziiRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (window.location.hash === '#recenzii') {
    setTimeout(() => {
      recenziiRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 300) // delay pentru ca DOM-ul să fie gata
  }
}, [])

  useEffect(() => {
    getUser().then((u) => {
      if (!u) router.push('/auth/login')
      else if (u.tip !== 'restaurant') router.push('/dashboard')
      else setUser(u)
    })
  }, [router])

  useEffect(() => {
    async function incarcaRecenzii() {
      const res = await fetch('/api/recenzii')
      const data = await res.json()
      setRecenzii(data)
    }

    if (user) incarcaRecenzii()
  }, [user])

  const trimiteRaspuns = async (id: number) => {
    const raspuns = raspunsuri[id]
    if (!raspuns) return

    const res = await fetch('/api/recenzii', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdRecenzie: id, RaspunsRestaurant: raspuns }),
    })

    if (res.ok) {
      setRecenzii((prev) =>
        prev.map((r) => (r.IdRecenzie === id ? { ...r, RaspunsRestaurant: raspuns } : r))
      )
      setRaspunsuri((prev) => ({ ...prev, [id]: '' }))
    } else {
      alert('Eroare la trimiterea răspunsului.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
            <Utensils size={48} className="text-emerald-600" />
          </div>
          <p className="text-emerald-600 text-lg font-semibold">Se verifică autentificarea...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Utensils size={48} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Dashboard Restaurant
              </h1>
              <p className="text-emerald-100 text-xl font-medium">Bine ai venit, {user.email}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Leaf size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">Parteneri pentru Sustenabilitate</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Funcționalități rapide */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-emerald-800">Gestionează Restaurantul</h2>
              <Leaf size={32} className="text-emerald-600" />
            </div>
            <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
              Controlează toate aspectele importante ale afacerii tale sustenabile
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-emerald-100 rounded-2xl mb-4 inline-block group-hover:bg-emerald-200 transition-colors">
                  <PlusCircle size={32} className="text-emerald-600" />
                </div>
                <Button
                  onClick={() => router.push('/add')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                >
                  Adaugă Produs
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-emerald-100 rounded-2xl mb-4 inline-block group-hover:bg-emerald-200 transition-colors">
                  <PlusCircle size={32} className="text-emerald-600" />
                </div>
                <Button
                  onClick={() => router.push('/adauga-oferta')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
                >
                  Adaugă Ofertă
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
  <CardContent className="p-6 text-center">
    <div className="p-4 bg-emerald-100 rounded-2xl mb-4 inline-block group-hover:bg-emerald-200 transition-colors">
      <PlusCircle size={32} className="text-emerald-600" />
    </div>
    <Button
      onClick={() => router.push('/adauga-stoc')}
      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-lg font-semibold"
    >
      Adaugă Stoc
    </Button>
  </CardContent>
</Card>


            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-emerald-100 rounded-2xl mb-4 inline-block group-hover:bg-emerald-200 transition-colors">
                  <ListOrdered size={32} className="text-emerald-600" />
                </div>
                <Button
                  onClick={() => router.push('/produse')}
                  variant="outline"
                  className="w-full border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-3 text-lg font-semibold transition-all duration-300"
                >
                  Vizualizează Produse
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-emerald-100 rounded-2xl mb-4 inline-block group-hover:bg-emerald-200 transition-colors">
                  <ClipboardList size={32} className="text-emerald-600" />
                </div>
                <Button
                  onClick={() => router.push('/comenzi')}
                  variant="outline"
                  className="w-full border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-3 text-lg font-semibold transition-all duration-300"
                >
                  Gestionează Comenzi
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recenzii */}
        <section ref={recenziiRef}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-emerald-800">Recenzii de la Clienți</h2>
              <Star size={32} className="text-amber-500 fill-current" />
            </div>
            <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
              Feedback-ul clienților este esențial pentru îmbunătățirea serviciilor sustenabile
            </p>
          </div>

          {recenzii.length === 0 ? (
            <div className="text-center py-20">
              <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
                <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                  <Star size={64} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Încă nu ai recenzii</h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-emerald-600 text-lg">
                    Când vei primi primele comenzi, recenziile vor apărea aici!
                  </p>
                  <Star size={24} className="text-amber-500 fill-current" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {recenzii.map((r) => (
                <Card key={r.IdRecenzie} className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <User size={20} className="text-emerald-600" />
                        </div>
                        <span className="font-bold text-emerald-800 text-lg">{r.NumeClient}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-xl border border-amber-200">
                        <Star size={18} className="text-amber-500 fill-current" />
                        <span className="font-bold text-amber-700">{r.Rating} / 5</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="p-4 bg-emerald-50/50 rounded-xl">
                      <p className="text-emerald-800 font-semibold mb-2">Mesajul clientului:</p>
                      <p className="text-emerald-700 leading-relaxed">{r.MesajClient}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <ClipboardList size={16} className="text-emerald-500" />
                        <p className="text-emerald-500 text-sm">
                          {new Date(r.DataRecenzie).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {r.RaspunsRestaurant ? (
                      <div className="p-4 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={18} className="text-emerald-600" />
                          <p className="text-emerald-800 font-semibold">Răspunsul tău:</p>
                        </div>
                        <p className="text-emerald-700 leading-relaxed">{r.RaspunsRestaurant}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          className="w-full border-2 border-emerald-200 rounded-xl p-4 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-white/80 backdrop-blur-sm text-emerald-800 placeholder-emerald-400"
                          placeholder="Scrie un răspuns profesional și prietenos..."
                          rows={3}
                          value={raspunsuri[r.IdRecenzie] || ''}
                          onChange={(e) =>
                            setRaspunsuri((prev) => ({
                              ...prev,
                              [r.IdRecenzie]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                          onClick={() => trimiteRaspuns(r.IdRecenzie)}
                        >
                          <PlusCircle size={18} />
                          Trimite Răspuns
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer Stats */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Contribuția Ta la Sustenabilitate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-3xl font-bold mb-2">{recenzii.length}</div>
              <div className="text-emerald-100">Recenzii Primite</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center">
              <Leaf size={32} className="text-emerald-100 mb-2" />
              <div className="text-emerald-100">Mâncare Salvată</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center">
              <Star size={32} className="text-emerald-100 mb-2" />
              <div className="text-emerald-100">Impact Pozitiv</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}