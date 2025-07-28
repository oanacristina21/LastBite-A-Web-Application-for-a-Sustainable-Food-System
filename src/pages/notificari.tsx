import { useEffect, useState } from 'react'
import { Bell, BellRing, Check, Clock, Leaf, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import axios from 'axios';
import { formatOraRomaniei } from '@/utils/date';
import { CodRidicareQRCode } from '@/components/CodRidicareQRCode';
import { useRouter } from 'next/router'



type Notificare = {
  IdNotificare: number
  Mesaj: string
  DataOraNotificare: string
}

export default function NotificariPage() {
  const [notificari, setNotificari] = useState<Notificare[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    fetch('/api/notificari')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error('Eroare API notificari:', res.status, text);
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        console.log('Notificari primite:', data);
        setNotificari(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch notificari failed:', err);
        setNotificari([]);
        setLoading(false);
      });
  }, []);

  const markAllAsRead = async () => {
  await axios.patch('/api/notificari/mark-read-all');
  window.location.reload();
  const res = await fetch('/api/notificari');
  const data = await res.json();
  setNotificari(data);
}


  
  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch('/api/notificari/mark-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setNotificari(ns => ns.filter(n => n.IdNotificare !== id))
        window.location.reload();

      }
    } catch (err) {
      console.error('Eroare la marcarea notificării:', err)
    }
  }

  const getNotificationIcon = (mesaj: string) => {
    if (mesaj.toLowerCase().includes('comandă') || mesaj.toLowerCase().includes('order')) {
      return <Utensils className="h-6 w-6 text-emerald-600" />
    }
    if (mesaj.toLowerCase().includes('sustenabil') || mesaj.toLowerCase().includes('eco')) {
      return <Leaf className="h-6 w-6 text-emerald-600" />
    }
    return <Bell className="h-6 w-6 text-emerald-600" />
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Acum'
    if (diffInMinutes < 60) return `${diffInMinutes} min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ore`
    return `${Math.floor(diffInMinutes / 1440)} zile`
  }
  const extractCodRidicare = (mesaj: string): string => {
  const match = mesaj.match(/Cod ridicare:\s*([A-Z0-9-]+)/i);
  return match ? match[1] : '';
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
            <Bell className="text-emerald-600" size={48} />
          </div>
          <p className="text-emerald-600 text-lg font-semibold">Se încarcă notificările...</p>
        </div>
      </div>
    )
  }

  if (notificari.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-11 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell size={36} className="text-emerald-100" />
              </div>
              <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Notificări
                </h1>
                <p className="text-emerald-100 text-xl font-medium">Rămâi la curent cu toate actualizările</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Leaf size={20} className="text-emerald-100" />
              <span className="text-emerald-100 font-semibold">LastBite - Pentru un viitor sustenabil</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Empty State */}
          <div className="text-center py-20">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
              <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                <BellRing size={64} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Nicio notificare nouă</h3>
              <p className="text-emerald-600 text-lg mb-6">
                Când vei avea notificări noi despre comenzi, promoții sustenabile sau actualizări importante, le vei vedea aici.
              </p>
              <div className="inline-flex items-center gap-3 bg-emerald-50 rounded-full px-6 py-3 border border-emerald-200">
                <Leaf size={20} className="text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Împreună pentru un viitor sustenabil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-15 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell size={36} className="text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                    Notificări
                  </h1>
                  <Badge className="bg-white/20 text-emerald-100 border-white/20 hover:bg-white/30 font-semibold text-lg px-4 py-2">
                    {notificari.length}
                  </Badge>
                </div>
                <p className="text-emerald-100 text-lg font-medium">Rămâi la curent cu toate actualizările</p>
              </div>
            </div>
            
            <Button 
              onClick={markAllAsRead}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-6 text-lg font-semibold backdrop-blur-sm"
            >
              <Check className="h-5 w-5 mr-2" />
              Marchează toate ca citite
            </Button>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Leaf size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">LastBite - Pentru un viitor sustenabil</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Notifications List */}
        <div className="space-y-6">
          {notificari.map((notificare) => (
            <Card 
              key={notificare.IdNotificare} 
              className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-4 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-colors">
                      {getNotificationIcon(notificare.Mesaj)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-emerald-800 font-semibold leading-relaxed mb-4 text-lg">
                      {notificare.Mesaj}
                    </p>
                    {/* QR dacă mesajul conține cod de ridicare */}
{notificare.Mesaj.includes('Cod ridicare:') && (
  <div className="mt-4">
    <CodRidicareQRCode cod={extractCodRidicare(notificare.Mesaj)} />
  </div>
)}

                    <div className="flex items-center gap-3 text-emerald-600">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-sm">{formatTimeAgo(notificare.DataOraNotificare)}</span>
                      </div>
                      <span className="text-emerald-400">•</span>
                      <span className="text-sm font-medium">
  {formatOraRomaniei(notificare.DataOraNotificare)}
</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notificare.IdNotificare)}
                      className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-2 px-4 font-semibold transition-all duration-300 hover:shadow-md"
                      title="Marchează ca citită"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Citit
                    </Button>
                    {notificare.Mesaj.toLowerCase().includes('recenzie') && (
  <Button
    onClick={() => router.push('/restaurant-dashboard#recenzii')}
    className="text-emerald-600 hover:text-emerald-800 underline text-sm mt-2"
    variant="ghost"
  >
    Vezi recenzia
  </Button>
)}

                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl text-emerald-700 shadow-lg border border-emerald-200">
            <Leaf className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-semibold">Fiecare notificare ne apropie de un viitor mai sustenabil</span>
          </div>
        </div>
      </div>
    </div>
  )
}