import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, AlertTriangle, Leaf, Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProdusCos = {
  IdProdus: number;
  Denumire: string;
  pret: number;
  cantitate: number;
  idRestaurant: number;
  Cant_Disp: number;
  restaurantName?: string;
};
type ProdusBrut = {
  IdProdus: number | string;
  Denumire: string;
  pret: number | string;
  cantitate: number | string;
  idRestaurant: number | string;
  Cant_Disp: number | string;
  restaurantName?: string;
};

export default function CosCumparaturi() {
  const [cos, setCos] = useState<ProdusCos[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cosLocal = localStorage.getItem('cos');
    if (cosLocal) {
      try {
const parsed = JSON.parse(cosLocal);
const normalizat = (parsed as ProdusBrut[]).map((p) => ({
  IdProdus: Number(p.IdProdus) || 0,
  Denumire: String(p.Denumire || 'Produs necunoscut'),
  pret: Number(p.pret) || 0,
  cantitate: Number(p.cantitate) || 1,
  idRestaurant: Number(p.idRestaurant) || 0,
  Cant_Disp: Number(p.Cant_Disp) || 0,
  restaurantName: p.restaurantName ? String(p.restaurantName) : 'necunoscut',
}));


setCos(normalizat);

      } catch {
        console.warn('Eroare la citirea coșului.');
      }
    }
  }, []);

  const actualizeazaCos = (cosNou: ProdusCos[]) => {
    setCos(cosNou);
    localStorage.setItem('cos', JSON.stringify(cosNou));
  };

  const modificaCantitate = (id: number, delta: number) => {
    const cosActualizat = cos.map(p => {
      if (p.IdProdus === id) {
        const nouaCant = p.cantitate + delta;
        return { ...p, cantitate: Math.max(1, Math.min(nouaCant, p.Cant_Disp)) };
      }
      return p;
    });
    actualizeazaCos(cosActualizat);
  };

  const eliminaProdus = (id: number) => {
    actualizeazaCos(cos.filter(p => p.IdProdus !== id));
  };

  const total = cos.reduce((sum, p) => sum + p.pret * p.cantitate, 0);

  const restauranteUnice = [...new Set(cos.map(p => p.idRestaurant))];
  const areProduseMultipleRestaurante = restauranteUnice.length > 1;

  
  const platesteComanda = async () => {
  if (cos.length === 0 || areProduseMultipleRestaurante) return;

  const produse = cos.map(p => ({
    id: p.IdProdus,
    cantitate: p.cantitate,
    pret: p.pret,
    denumire: p.Denumire,
  }));

  try {
    const stripeRes = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produse }),
    });

    const { url } = await stripeRes.json();
    window.location.href = url;
  } catch (err) {
    const mesaj = err instanceof Error ? err.message : 'Eroare necunoscută';
    alert(mesaj);
  }
};

  // Dacă coșul este gol, afișează mesajul corespunzător
  if (cos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ShoppingCart size={36} className="text-emerald-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Coșul de Cumpărături
                </h1>
                <p className="text-emerald-100 text-lg font-medium">Salvează mâncarea delicioasă și luptă împotriva risipei alimentare</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center max-w-md bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-emerald-100">
            <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
              <ShoppingCart size={48} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Coșul este gol</h3>
            <p className="text-emerald-600 mb-6 leading-relaxed">Începe să salvezi mâncarea delicioasă de la risipă și contribuie la un viitor sustenabil</p>
            <Button
              onClick={() => router.push('/restaurante')}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              <span>Explorează Restaurantele</span>
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render principal al coșului cu toate funcționalitățile
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ShoppingCart size={36} className="text-emerald-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Coșul de Cumpărături
                </h1>
                <p className="text-emerald-100 text-lg font-medium">Salvează mâncarea delicioasă și luptă împotriva risipei alimentare</p>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Package size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">{cos.length} {cos.length === 1 ? 'produs' : 'produse'} în coș</span>
          </div>
        </div>
      </div>

      {/* Lista produse */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {areProduseMultipleRestaurante && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Atenție!</h3>
              <p className="text-red-700">
                Coșul conține produse de la restaurante diferite. Nu poți plasa comanda până nu le elimini.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {cos.map(produs => (
            <Card
              key={produs.IdProdus}
              className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-emerald-800 mb-4 group-hover:text-emerald-600 transition-colors">
                      {produs.Denumire}
                    </h3>
                    <p className="text-sm text-emerald-500 font-medium mb-2">
  Restaurant: {produs.restaurantName || 'necunoscut'}
</p>

                    {/* Controale cantitate */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                        <Button
                          onClick={() => modificaCantitate(produs.IdProdus, -1)}
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 hover:bg-emerald-100 text-emerald-600 rounded-lg"
                        >
                          <Minus size={18} />
                        </Button>
                        <span className="mx-6 font-bold text-emerald-800 min-w-[3rem] text-center text-lg">
                          {produs.cantitate}
                        </span>
                        <Button
                          onClick={() => modificaCantitate(produs.IdProdus, 1)}
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 hover:bg-emerald-100 text-emerald-600 rounded-lg"
                          disabled={produs.cantitate >= produs.Cant_Disp}
                        >
                          <Plus size={18} />
                        </Button>
                      </div>

                      <div className="text-emerald-700 font-semibold text-lg">
                        {produs.pret.toFixed(2)} RON per bucată
                      </div>
                    </div>

                    {/* Info stoc */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <Leaf size={16} className="text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium">
                        Stoc disponibil: {produs.Cant_Disp} bucăți
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-emerald-800">
                        {(produs.pret * produs.cantitate).toFixed(2)} RON
                      </div>
                      <Button
                        onClick={() => eliminaProdus(produs.IdProdus)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        <span>Elimină</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rezumat comandă */}
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <ShoppingCart size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">Rezumatul Comenzii</h2>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl text-emerald-700 font-semibold">Total de plată:</span>
              <span className="text-3xl font-bold text-emerald-800">{total.toFixed(2)} RON</span>
            </div>

            <div className="flex items-center gap-4 mb-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf size={20} className="text-emerald-600" />
              </div>
              <span className="text-emerald-700 font-semibold">
                Mulțumim că ne ajuți să reducem risipa alimentară
              </span>
            </div>

            <Button
              onClick={platesteComanda}
              disabled={areProduseMultipleRestaurante}
              className={`w-full py-4 rounded-xl font-bold transition-all duration-300 text-lg ${
                areProduseMultipleRestaurante
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {areProduseMultipleRestaurante ? "Elimină produsele de la restaurante diferite" : (
                <div className="flex items-center justify-center gap-2">
                  <span>Platește Comanda</span>
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Impact */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Impactul Tău Sustenabil</h3>
          <p className="text-emerald-100 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Cu această comandă contribui la reducerea risipei alimentare și sprijini afacerile locale
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-emerald-100 font-semibold">
            <Leaf size={16} className="mr-2" />
            Fiecare comandă contează pentru planeta noastră
          </div>
        </div>
      </div>
    </div>
  );
}