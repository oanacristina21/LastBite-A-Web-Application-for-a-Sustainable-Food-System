import { useEffect, useState } from 'react';
import { CheckCircle, Package, Calendar, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import  Input  from '@/components/ui/input';
import { useRouter } from 'next/router';
import  Label  from '@/components/ui/label';
import Select from 'react-select';


type Produs = {
  IdProdus: number;
  Denumire: string;
};

export default function AdaugaStoc() {
  const [produseFaraStoc, setProduseFaraStoc] = useState<Produs[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cantitate, setCantitate] = useState(1);
  const router = useRouter();


  useEffect(() => {
    fetch('/api/produse/fara-stoc')
      .then(res => res.json())
      .then(data => setProduseFaraStoc(data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedId || cantitate <= 0) {
      alert('Completează toate câmpurile corect.');
      return;
    }

    const res = await fetch('/api/adauga-stoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IdProdus: selectedId, Cant_Disp: cantitate}),
    });

    if (res.ok) {
      alert('Stoc adăugat!');
      router.push('/restaurant-dashboard');

    } else {
      const err = await res.json();
      alert(err.mesaj || 'Eroare la adăugare.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Package size={48} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Adaugă Stoc Nou
              </h1>
              <p className="text-emerald-100 text-xl font-medium">Gestionează inventarul tău eficient</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl overflow-hidden shadow-xl">
          <CardHeader className="pb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
            <CardTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-3 pt-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Package size={24} className="text-emerald-600" />
              </div>
              Configurare Stoc Nou
            </CardTitle>
            <p className="text-emerald-600 font-medium">Completează detaliile pentru adăugarea stocului</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Select Product */}
            <div className="space-y-3">
  <label className="block mb-1 text-emerald-700 font-medium">Selectează Produsul</label>
  <Select
    value={
      selectedId
        ? { value: selectedId, label: produseFaraStoc.find(p => p.IdProdus === selectedId)?.Denumire }
        : null
    }
    onChange={(opt) => setSelectedId(opt?.value || null)}
    options={produseFaraStoc.map(p => ({ value: p.IdProdus, label: p.Denumire }))}
    placeholder="Alege un produs fără stoc..."
    className="z-50"
  />
</div>

            {/* Quantity */}
            <div className="space-y-3">
              <Label htmlFor="cantitate" className="text-emerald-700 font-medium flex items-center gap-2">
                <Hash size={16} />
                Cantitate Disponibilă
              </Label>
              <Input
                id="cantitate"
                type="number"
                value={cantitate}
                onChange={(e) => setCantitate(Number(e.target.value))}
                min="1"
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100 bg-white/80"
              />
            </div>

            {/* Info Box */}
            <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle size={16} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    Sfaturi pentru Gestionarea Stocului
                  </h4>
                  <ul className="text-sm text-emerald-600 space-y-1">
                    <li>• Monitorizează stocurile și ajustează în funcție de cerere</li>
                    <li>• Adaugă cantități realiste pe baza cererii</li>
                    <li>• Monitorizează stocul pentru a evita risipa</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-emerald-100">
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg"
              >
                <CheckCircle size={20} className="mr-2" />
                Adaugă Stoc în Inventar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Inventar Organizat</h3>
            <p className="text-emerald-600 text-sm">
              Ține evidența precisă a stocurilor disponibile
            </p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Urmărire Expirare</h3>
            <p className="text-emerald-600 text-sm">
              Monitorizează datele de expirare pentru eficiență
            </p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Gestionare Optimă</h3>
            <p className="text-emerald-600 text-sm">
              Asigură disponibilitatea produselor pentru clienți
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Impact Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Gestionarea Eficientă a Stocului</h3>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Prin adăugarea și monitorizarea corectă a stocurilor, contribui la reducerea risipei alimentare 
            și la oferirea unei experiențe de calitate clienților tăi.
          </p>
        </div>
      </div>
    </div>
  );
}