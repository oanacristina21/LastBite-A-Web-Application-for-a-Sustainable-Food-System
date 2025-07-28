import { useEffect, useState } from 'react';
import { getUser } from '../lib/authClient';
import type { User } from '../lib/types';
import { formatOraRomaniei } from '@/utils/date';
import ComandaDetaliiModal from '@/components/ui/ComandaDetaliiModal';
import type { ComandaDetalii } from '@/components/ui/ComandaDetaliiModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog2';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Star, 
  X, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Package,
  Utensils
} from 'lucide-react';

type ProdusComandat = {
  IdProdus: number;
  CantitateComandata: number;
  PretFinal: number;
  PRODUS: {
    Denumire: string;
    OFERTA?: {
      DataSfarsit: string;
    }[];
  };
};

type Recenzie = {
  IdRecenzie: number;
  MesajClient: string;
  Rating: number;
};

type Comanda = {
  IdComanda: number;
  NrComanda: string;
  DataComanda: string;
  StatusComanda: string;
  COMANDA_PRODUS: ProdusComandat[];
  RECENZIE?: Recenzie | null;
  RESTAURANT?: {
    Denumire: string;
    Adresa: string;
    Latitude?: number | null;     
    Longitude?: number | null;    
  };
};

export default function ComenzileMele() {
  const [user, setUser] = useState<User | null>(null);
  const [comenzi, setComenzi] = useState<Comanda[]>([]);
  const [selectedComandaId, setSelectedComandaId] = useState<number | null>(null);
  const [mesaj, setMesaj] = useState('');
  const [rating, setRating] = useState(5);
  const [comandaSelectata, setComandaSelectata] = useState<ComandaDetalii | null>(null);

  useEffect(() => {
    getUser().then(async (u) => {
      if (!u) return;
      setUser(u);

      const res = await fetch('/api/comenzi');
      const data = await res.json();

      if (Array.isArray(data)) {
        setComenzi(data);
      } else {
        console.warn('Date invalide:', data);
        setComenzi([]);
      }
    });
  }, []);

  const anuleazaComanda = async (idComanda: number) => {
    const confirmare = confirm('Ești sigur că vrei să anulezi comanda?');
    if (!confirmare) return;

    const res = await fetch(`/api/comenzi/${idComanda}/anuleaza`, {
      method: 'PATCH',
    });

    if (res.ok) {
      alert('Comanda anulată.');
      setComenzi((prev) =>
        prev.map((c) =>
          c.IdComanda === idComanda ? { ...c, StatusComanda: 'Anulata' } : c
        )
      );
    } else {
      const data = await res.json();
      alert(data.mesaj || 'Eroare la anulare.');
    }
  };



  const trimiteRecenzie = async () => {
    if (!selectedComandaId) return;

    const res = await fetch('/api/recenzii-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idComanda: selectedComandaId,
        mesaj: mesaj,
        rating: rating
      }),
    });

    if (res.ok) {
      alert('Recenzie trimisă!');
      setMesaj('');
      setRating(5);
      setComenzi((prev) =>
        prev.map((c) =>
          c.IdComanda === selectedComandaId
            ? { ...c, RECENZIE: { IdRecenzie: -1, MesajClient: mesaj, Rating: rating } }
            : c
        )
      );
    } else {
      const data = await res.json();
      alert(data.mesaj || 'Eroare la trimiterea recenziei.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Plasata':
        return <Clock size={20} className="text-amber-600" />;
      case 'Finalizata':
        return <CheckCircle size={20} className="text-emerald-600" />;
      case 'Anulata':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Package size={20} className="text-emerald-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Plasata':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Finalizata':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Anulata':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <ShoppingBag size={48} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Comenzile Tale
              </h1>
              <p className="text-emerald-100 text-xl font-medium">Istoricul comenzilor tale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {comenzi.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
              <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                <ShoppingBag size={64} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Nu ai comenzi încă</h3>
              <p className="text-emerald-600 text-lg">
                Când vei plasa prima comandă, aceasta va apărea aici!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {comenzi.map((comanda) => (
              <Card key={comanda.IdComanda} className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Package size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800 text-lg">#{comanda.NrComanda}</span>
                        <p className="text-emerald-600 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {formatOraRomaniei(comanda.DataComanda)}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(comanda.StatusComanda)}`}>
                      {getStatusIcon(comanda.StatusComanda)}
                      <span className="font-bold">{comanda.StatusComanda}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Restaurant Info */}
                  {comanda.RESTAURANT && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-lg">
                      <MapPin size={16} className="text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-800">{comanda.RESTAURANT.Denumire}</p>
                        <p className="text-emerald-600 text-sm">{comanda.RESTAURANT.Adresa}</p>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div className="space-y-2">
                    {comanda.COMANDA_PRODUS.map((cp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                        <div>
                          <span className="font-medium text-emerald-800">{cp.PRODUS.Denumire}</span>
                          <p className="text-emerald-600 text-sm">Cantitate: {cp.CantitateComandata}</p>
                        </div>
                        <span className="font-semibold text-emerald-800">
                          {Number(cp.PretFinal).toFixed(2)} RON
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-200">
                    <span className="text-lg font-semibold text-emerald-800">Total comandă:</span>
                    <span className="text-xl font-bold text-emerald-800">
                      {comanda.COMANDA_PRODUS.reduce(
                        (suma, cp) => suma + Number(cp.PretFinal) * cp.CantitateComandata,
                        0
                      ).toFixed(2)} RON
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setComandaSelectata({
                        id: comanda.IdComanda,
                        restaurant: comanda.RESTAURANT?.Denumire ?? 'Restaurant necunoscut',
                        locatie: comanda.RESTAURANT?.Adresa ?? 'Adresă indisponibilă',
                        produse: comanda.COMANDA_PRODUS.map((cp) => ({
                          Denumire: cp.PRODUS.Denumire,
                          Cantitate: cp.CantitateComandata,
                          Pret: cp.PretFinal
                        })),
                        status: comanda.StatusComanda,
                        dataInceput: comanda.DataComanda,
                        dataSfarsit: comanda.COMANDA_PRODUS[0]?.PRODUS?.OFERTA?.[0]?.DataSfarsit ?? null,
                        latitude: comanda.RESTAURANT?.Latitude ?? null,
                        longitude: comanda.RESTAURANT?.Longitude ?? null
                      })}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Eye size={16} className="mr-2" />
                      Vezi detalii
                    </Button>

                    {comanda.StatusComanda === 'Plasata' && (
                      <Button
                        onClick={() => anuleazaComanda(comanda.IdComanda)}
                        variant="outline"
                        className="border-2 border-red-300 text-red-700 hover:bg-red-50 rounded-xl px-4 py-2 font-semibold transition-all duration-300"
                      >
                        <X size={16} className="mr-2" />
                        Anulează
                      </Button>
                    )}

                    {comanda.StatusComanda === 'Finalizata' && !comanda.RECENZIE && (
  <>
    <Button
      onClick={() => setSelectedComandaId(comanda.IdComanda)}
      variant="outline"
      className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl px-4 py-2 font-semibold transition-all duration-300"
    >
      <Star size={16} className="mr-2" />
      Adaugă recenzie
    </Button>

    {selectedComandaId === comanda.IdComanda && (
      <Dialog open={true} onOpenChange={() => setSelectedComandaId(null)}>
        <DialogContent className="w-full mt-4 bg-white border border-emerald-200 rounded-xl p-6 shadow-md">
          <DialogTitle className="text-xl font-bold text-emerald-800 mb-4">
            Adaugă recenzie
          </DialogTitle>

          <div className="space-y-4">
            <div>
              <label className="block text-emerald-800 font-medium mb-2">Mesajul tău</label>
              <textarea
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="Scrie recenzia..."
                className="w-full border-2 border-emerald-200 rounded-xl p-3"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-emerald-800 font-medium mb-2">Rating (1-5 stele)</label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min={1}
                max={5}
                className="w-full border-2 border-emerald-200 rounded-xl p-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setSelectedComandaId(null)}
                variant="outline"
                className="border border-gray-300 text-gray-700"
              >
                Anulează
              </Button>
              <Button
                onClick={trimiteRecenzie}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Trimite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </>
)}

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comanda Details Modal */}
      {comandaSelectata && (
        <ComandaDetaliiModal
          comanda={comandaSelectata}
          onClose={() => setComandaSelectata(null)}
        />
      )}

      
    </div>
  );
}