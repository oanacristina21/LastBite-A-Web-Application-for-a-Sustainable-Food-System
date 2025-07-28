import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import  Input  from '@/components/ui/input'
import  Label  from '@/components/ui/label'
import  Separator  from '@/components/ui/separator'
import { User, Phone, Mail, Lock, CheckCircle, AlertCircle, Loader2, Settings, Leaf } from 'lucide-react'

export default function ProfilPage() {
  const [loading, setLoading] = useState(true)
  const [nume, setNume] = useState('')
  const [prenume, setPrenume] = useState('')
  const [nrTelefon, setNrTelefon] = useState('')
  const [email, setEmail] = useState('')
  const [parolaNoua, setParolaNoua] = useState('')
  const [confirmaParola, setConfirmaParola] = useState('')
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    async function fetchProfil() {
      try {
        const res = await fetch('/api/profil-client')
        if (!res.ok) throw new Error('Eroare la preluare')
        const data = await res.json()
        setNume(data.nume)
        setPrenume(data.prenume)
        setNrTelefon(data.nrTelefon)
        setEmail(data.email)
      } catch (err) {
        console.error(err)
        setMesaj('Eroare la încărcarea datelor')
      } finally {
        setLoading(false)
      }
    }

    fetchProfil()
  }, [])

  const handleSalveaza = async () => {
    if (parolaNoua && parolaNoua !== confirmaParola) {
      setMesaj('Parolele nu coincid')
      return
    }

    try {
      const res = await fetch('/api/profil-client', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume,
          prenume,
          nrTelefon,
          email,
          parolaNoua: parolaNoua || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMesaj('Profil actualizat cu succes!')
        setParolaNoua('')
        setConfirmaParola('')
      } else {
        setMesaj(data.mesaj || 'Eroare la actualizare')
      }
    } catch (err) {
      console.error(err)
      setMesaj('Eroare la trimitere')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
            <Loader2 size={48} className="text-emerald-600 animate-spin" />
          </div>
          <p className="text-emerald-600 text-lg font-semibold">Se încarcă profilul...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Settings size={48} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Profilul Meu
              </h1>
              <p className="text-emerald-100 text-xl font-medium">Actualizează informațiile tale personale</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Leaf size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">Alătură-te mișcării pentru sustenabilitate</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl overflow-hidden shadow-xl">
          <CardHeader className="pb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
            <CardTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-3 pt-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User size={24} className="text-emerald-600" />
              </div>
              Informații Personale
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Message Display */}
            {mesaj && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                mesaj.includes('succes') 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {mesaj.includes('succes') ? (
                  <CheckCircle size={20} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={20} className="text-red-600" />
                )}
                <span className="font-medium">{mesaj}</span>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-800">Informații de bază</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nume" className="text-emerald-700 font-medium flex items-center gap-2">
                    <User size={16} />
                    Nume
                  </Label>
                  <Input
                    id="nume"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>

                <div>
                  <Label htmlFor="prenume" className="text-emerald-700 font-medium flex items-center gap-2">
                    <User size={16} />
                    Prenume
                  </Label>
                  <Input
                    id="prenume"
                    value={prenume}
                    onChange={(e) => setPrenume(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>

                <div>
                  <Label htmlFor="nrTelefon" className="text-emerald-700 font-medium flex items-center gap-2">
                    <Phone size={16} />
                    Număr de telefon
                  </Label>
                  <Input
                    id="nrTelefon"
                    value={nrTelefon}
                    onChange={(e) => setNrTelefon(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-emerald-700 font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-emerald-200" />

            {/* Password Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-800">Schimbare parolă</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="parolaNoua" className="text-emerald-700 font-medium flex items-center gap-2">
                    <Lock size={16} />
                    Parolă nouă (opțional)
                  </Label>
                  <Input
                    id="parolaNoua"
                    type="password"
                    value={parolaNoua}
                    onChange={(e) => setParolaNoua(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmaParola" className="text-emerald-700 font-medium flex items-center gap-2">
                    <Lock size={16} />
                    Confirmă parola
                  </Label>
                  <Input
                    id="confirmaParola"
                    type="password"
                    value={confirmaParola}
                    onChange={(e) => setConfirmaParola(e.target.value)}
                    className="w-full mt-2 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSalveaza}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-semibold"
            >
              <CheckCircle size={20} className="mr-2" />
              Salvează Modificările
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}