import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { formatOraRomaniei } from '@/utils/date'
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Package, 
  XCircle, 
  User, 
  Calendar,
  DollarSign,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock auth function for now - replace with actual implementation
const getUser = async () => {
  return { id: 1, email: 'restaurant@example.com', tip: 'restaurant' as const }
}

type Comanda = {
  id: number
  nrComanda: number
  client: string
  produse: string[]
  total: number
  data: string
  status: StatusComanda
}

type StatusComanda =
  | 'Plasata'
  | 'Confirmata'
  | 'In Pregatire'
  | 'Gata de Ridicare'
  | 'Finalizata'
  | 'Anulata'

type User = {
  id: number
  email: string
  tip: 'restaurant' | 'client'
}

const statusConfig = {
  'Plasata': { icon: Clock, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  'Confirmata': { icon: CheckCircle, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  'In Pregatire': { icon: ChefHat, color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  'Gata de Ridicare': { icon: Package, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  'Finalizata': { icon: CheckCircle, color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  'Anulata': { icon: XCircle, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' }
}

export default function ComenziPage() {
  const [user, setUser] = useState<User | null>(null)
  const [comenzi, setComenzi] = useState<Comanda[]>([])
  const router = useRouter()

  const statusuri: StatusComanda[] = [
    'Plasata',
    'Confirmata',
    'In Pregatire',
    'Gata de Ridicare',
    'Finalizata',
    'Anulata',
  ]

  useEffect(() => {
    getUser().then((u) => {
      if (!u) router.push('/auth/login')
      else if (u.tip !== 'restaurant') router.push('/dashboard')
      else setUser(u)
    })
  }, [router])

  useEffect(() => {
    async function fetchComenzi() {
      try {
        const res = await fetch('/api/comenzi-restaurant')
        const data = await res.json()
        setComenzi(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    if (user) fetchComenzi()
  }, [user])

  const updateStatus = async (id: number, newStatus: StatusComanda) => {
    const res = await fetch(`/api/comenzi/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      setComenzi((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
    } else {
      alert('Eroare la actualizarea statusului.')
    }
  }

  const comenziActive = comenzi.filter(
    (c) => !['Finalizata', 'Anulata'].includes(c.status)
  )
  const comenziFinalizate = comenzi.filter((c) =>
    ['Finalizata', 'Anulata'].includes(c.status)
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"></div>
            <p className="text-emerald-600 text-lg">Se verifică autentificarea...</p>
          </div>
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
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Package size={48} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Gestionare Comenzi
              </h1>
              <p className="text-xl text-emerald-100 mt-2">
                Urmărește și gestionează comenzile sustenabile!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Stats Overview */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Clock size={32} className="mx-auto mb-3 text-blue-100" />
                <div className="text-2xl font-bold">{comenziActive.length}</div>
                <div className="text-blue-100">Comenzi Active</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <TrendingUp size={32} className="mx-auto mb-3 text-emerald-100" />
                <div className="text-2xl font-bold">{comenzi.length}</div>
                <div className="text-emerald-100">Total Comenzi</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <DollarSign size={32} className="mx-auto mb-3 text-purple-100" />
                <div className="text-2xl font-bold">
                  {comenzi.reduce((sum, c) => sum + c.total, 0).toFixed(0)} RON
                </div>
                <div className="text-purple-100">Venituri Totale</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <CheckCircle size={32} className="mx-auto mb-3 text-amber-100" />
                <div className="text-2xl font-bold">
                  {comenzi.filter(c => c.status === 'Finalizata').length}
                </div>
                <div className="text-amber-100">Finalizate</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Active Orders */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-emerald-600" size={32} />
            <h2 className="text-3xl font-bold text-emerald-800">
              Comenzi Active ({comenziActive.length})
            </h2>
          </div>

          {comenziActive.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
                <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                  <Package size={64} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Fără comenzi active</h3>
                <p className="text-emerald-600 text-lg">
                  Comenzile vor apărea aici când clienții vor plasa ordine! 
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {comenziActive.map((c) => {
                const statusInfo = statusConfig[c.status] || {
  icon: AlertCircle,
  bgColor: 'bg-gray-200',
  textColor: 'text-gray-700'
}

                const StatusIcon = statusInfo.icon
                
                return (
                  <Card key={c.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-100 rounded-full">
                            <User size={24} className="text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-emerald-800">
                              Comandă #{c.nrComanda}
                            </h3>
                            <p className="text-emerald-600 font-medium">
                              Client: {c.client}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0 px-4 py-2 font-bold`}>
                          <StatusIcon size={16} className="mr-2" />
                          {c.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <Package size={20} className="text-emerald-600" />
                            <div>
                              <p className="font-semibold text-emerald-800">Produse:</p>
                              <p className="text-emerald-600">{c.produse.join(', ')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <Calendar size={20} className="text-emerald-600" />
                            <div>
                              <p className="font-semibold text-emerald-800">Data comenzii:</p>
                              <p className="text-emerald-600">
                                {formatOraRomaniei(c.data)}

                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <DollarSign size={20} className="text-emerald-600" />
                            <div>
                              <p className="font-semibold text-emerald-800">Total:</p>
                              <p className="text-2xl font-bold text-emerald-700">{c.total} RON</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-emerald-50 rounded-xl">
                            <label className="block">
                              <span className="font-semibold text-emerald-800 mb-2 block">
                                Actualizează statusul:
                              </span>
                              <select
                                value={c.status}
                                onChange={(e) => updateStatus(c.id, e.target.value as StatusComanda)}
                                className="w-full border border-emerald-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                              >
                                {statusuri.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Completed Orders */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="text-emerald-600" size={32} />
            <h2 className="text-3xl font-bold text-emerald-800">
              Comenzi Finalizate / Anulate ({comenziFinalizate.length})
            </h2>
          </div>

          {comenziFinalizate.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gray-50 rounded-2xl max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Fără comenzi finalizate
                </h3>
                <p className="text-gray-600">
                  Comenzile finalizate vor apărea aici în curând! 
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {comenziFinalizate.map((c) => {
                const statusInfo = statusConfig[c.status]
                const StatusIcon = statusInfo.icon
                
                return (
                  <Card key={c.id} className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              Comandă #{c.id} - {c.client}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {c.produse.join(', ')} • {c.total} RON
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatOraRomaniei(c.data)}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0`}>
                          <StatusIcon size={14} className="mr-1" />
                          {c.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Impact Section */}
        <section className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative text-center">
            <h3 className="text-2xl font-bold mb-4">Impactul Tău Sustenabil</h3>
            <p className="text-emerald-100 mb-8">
              Fiecare comandă contribuie la reducerea risipei alimentare! 
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl mb-3"></div>
                <div className="font-bold text-lg">Mâncare Salvată</div>
                <div className="text-emerald-100 text-sm">
                  Reduci risipa alimentară cu fiecare comandă
                </div>
              </div>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl mb-3"></div>
                <div className="font-bold text-lg">Clienți Serviți</div>
                <div className="text-emerald-100 text-sm">
                  Construiești o comunitate sustenabilă
                </div>
              </div>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl mb-3"></div>
                <div className="font-bold text-lg">Impact Pozitiv</div>
                <div className="text-emerald-100 text-sm">
                  Contribui la un viitor mai verde
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
