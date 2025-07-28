import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, Leaf, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { useRouter } from 'next/router';

type Produs = {
  IdProdus: number;
  Denumire: string;
};

export default function AdaugaOferta() {
  const [produse, setProduse] = useState<Produs[]>([]);
  const [produsId, setProdusId] = useState<number | null>(null);
  const [reducere, setReducere] = useState<number>(0);
  const [dataInceput, setDataInceput] = useState<string>('');
  const [dataSfarsit, setDataSfarsit] = useState<string>('');
    const router = useRouter();
    const now = new Date().toISOString().slice(0, 16);


  useEffect(() => {
    axios.get('/api/produse/cu-stoc-si-fara-oferta').then(res => setProduse(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produsId || !dataInceput || !dataSfarsit) {
      return alert('Completează toate câmpurile!');
    }

    const startUtc = new Date(dataInceput).toISOString();
    const endUtc = new Date(dataSfarsit).toISOString();

    try {
      await axios.post('/api/oferte', {
        IdProdus: produsId,
        Reducere: reducere,
        DataInceput: startUtc,
        DataSfarsit: endUtc,
      });

      alert('Ofertă adăugată cu succes!');
      router.push('/restaurant-dashboard');
      setProdusId(null);
      setReducere(0);
      setDataInceput('');
      setDataSfarsit('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.mesaj || 'Eroare la adăugare ofertă!';
        alert(msg);

        const redirectTo = err.response?.data?.redirect;
        if (redirectTo) {
          window.location.href = redirectTo;
        }
      } else {
        alert('Eroare necunoscută.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* … header … */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle>Configurare Ofertă Nouă</CardTitle>
            <p className="text-emerald-600">Completează detaliile ofertei</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Produs */}
              <div>
                <label className="block mb-1">Selectează Produsul</label>
                <Select
                  value={
                    produsId
                      ? { value: produsId, label: produse.find(p => p.IdProdus === produsId)?.Denumire }
                      : null
                  }
                  onChange={opt => setProdusId(opt?.value || null)}
                  options={produse.map(p => ({ value: p.IdProdus, label: p.Denumire }))}
                  placeholder="Alege produs…"
                  required
                />
              </div>

              {/* Reducere */}
              <div>
                <label className="block mb-1">Reducere (RON)</label>
                <input
                  type="number"
                  value={reducere}
                  onChange={e => setReducere(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Date Ofertă */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Data și Ora Început</label>
                  <input
                    type="datetime-local"
                    value={dataInceput}
                    onChange={e => setDataInceput(e.target.value)}
                    className="w-full border p-2 rounded"
                    min={now}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Data și Ora Sfârșit</label>
                  <input
                    type="datetime-local"
                    value={dataSfarsit}
                    onChange={e => setDataSfarsit(e.target.value)}
                    className="w-full border p-2 rounded"
                    min={now}
                    required
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Star size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-2">
                      Sfaturi pentru Oferte Sustenabile
                    </h4>
                    <ul className="text-sm text-emerald-600 space-y-1">
                      <li>• Setează reduceri atractive pentru produsele aproape de expirare</li>
                      <li>• Programează ofertele în momentele optime pentru clienți</li>
                      <li>• Contribui la reducerea risipei alimentare</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-emerald-100">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <CheckCircle size={20} className="mr-2" />
                  Salvează Oferta Sustenabilă
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Leaf size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Reduci Risipa</h3>
            <p className="text-emerald-600 text-sm">
              Ofertele tale ajută la salvarea alimentelor
            </p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Generezi Vânzări</h3>
            <p className="text-emerald-600 text-sm">
              Atrage mai mulți clienți cu prețuri competitive
            </p>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl text-center border border-emerald-100">
            <div className="p-3 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Construiești Comunitate</h3>
            <p className="text-emerald-600 text-sm">
              Fidelizezi clienții prin practici sustenabile
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Impact Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Fiecare Ofertă Contează pentru Planeta Noastră</h3>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Prin crearea de oferte sustenabile, contribui activ la reducerea risipei alimentare 
            și la construirea unui viitor mai verde pentru următoarele generații.
          </p>
        </div>
      </div>
    </div>
  );
}
