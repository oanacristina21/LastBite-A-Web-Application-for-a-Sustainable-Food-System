import { useEffect, useState } from 'react';
import { Package, Edit, Trash2, Star, Calendar, ShoppingBag, AlertTriangle, CheckCircle, Leaf, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Input  from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog2'; // sau path-ul tău real
import { ChangeEvent } from "react";
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';




type Stoc = {
  Cant_Disp: number;
  DataValab?: string; // sau `Date` dacă lucrezi direct cu obiecte Date
};


type Oferta = {
  Reducere: number;
  DataInceput: string;
  DataSfarsit: string;
};

type Produs = {
  IdProdus: number;
  Denumire: string;
  Descriere: string;
  Pret_Initial: number;
  DataProducere: string;
  DataExpirare: string;
  STOC: Stoc[];
  OFERTA: Oferta[];
};

export default function ListaProduse() {
  const [produse, setProduse] = useState<Produs[]>([]);
  const [editProdus, setEditProdus] = useState<Produs | null>(null);
  const [reactiveProdus, setReactiveProdus] = useState<Produs | null>(null);
const [reactiveData, setReactiveData] = useState({
  Reducere: 1,
  DataInceput: '',
  DataSfarsit: '',
  Cant_Disp: 1,
  DataProducere: '', // 👈 nou
  DataExpirare: '',  // 👈 nou
});
const now = new Date().toISOString().slice(0, 16);



const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return formatInTimeZone(date, 'Europe/Bucharest', 'dd.MM.yyyy, HH:mm');
};

// Pentru popularea input-ului <input type="datetime-local" />
const toLocalDatetimeValue = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  const date = new Date(isoString); // Convert to browser's local time zone
  // Format for datetime-local input: YYYY-MM-DDTHH:MM
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const isExpired = (dataExpirare: string) => {
  return new Date(dataExpirare) < new Date();
};


  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/produse');
      const data = await res.json();

      if (Array.isArray(data)) {
        setProduse(data);
      } else {
        console.error("API /api/produse NU a returnat un array!", data);
        setProduse([]);
      }
    }

    fetchData();
  }, []);

  const stergeProdus = async (id: number) => {
    const confirmare = confirm('Sigur vrei să ștergi produsul?');
    if (!confirmare) return;

    const res = await fetch(`/api/produse?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Produs șters cu succes.');
      setProduse((prev) => prev.filter(p => p.IdProdus !== id));
    } else {
      const err = await res.json();
      alert(err.mesaj || 'Eroare la ștergere.');
    }
  };

  const modificaProdus = (produs: Produs) => {
    setEditProdus(produs);
  };

  const salveazaModificari = async () => {
    if (!editProdus) return;
    const { OFERTA, STOC, ...rest } = editProdus;

    const oferta = OFERTA?.[0] || {};


const payload = {
  ...rest,
  IdProdus: editProdus.IdProdus,
  Cant_Disp: STOC?.[0]?.Cant_Disp || 0,
  Reducere: oferta.Reducere ?? 0,
  DataInceput: editProdus.OFERTA?.[0]?.DataInceput || null, 
  DataSfarsit: editProdus.OFERTA?.[0]?.DataSfarsit || null, 
  DataProducere: editProdus.DataProducere, 
  DataExpirare: editProdus.DataExpirare,
};

    const res = await fetch('/api/produse', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Produs modificat.');
      setEditProdus(null);
      const updated = await res.json();
      setProduse((prev) =>
        prev.map(p => p.IdProdus === updated.IdProdus ? updated : p)
      );
    } else {
      const err = await res.json();
      alert(err.mesaj || 'Eroare la salvare.');
    }
  };

  const getOfferStatus = (oferta?: Oferta) => {
  if (!oferta || !oferta.DataSfarsit) return null;
  const now = new Date();
  const endDate = new Date(oferta.DataSfarsit);
  return endDate < now ? 'expired' : 'active';
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Package size={48} className="text-emerald-100" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Gestionare Produse
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Administrează produsele sustenabile și contribuie la reducerea risipei alimentare!
          </p>
          <div className="flex justify-center mt-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Leaf size={24} className="text-emerald-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {produse.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
              <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                <Package size={64} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Niciun produs încă</h3>
              <p className="text-emerald-600 text-lg">
                Adaugă primul tău produs sustenabil pentru a începe să salvezi mâncarea!
              </p>
              <div className="flex justify-center mt-4">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Leaf size={20} className="text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-emerald-800 mb-4 flex items-center justify-center gap-3">
                {produse.length} Produse Sustenabile
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Leaf size={24} className="text-emerald-600" />
                </div>
              </h2>
              <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
                Gestionează portofoliul tău de produse și ajută la reducerea risipei alimentare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {produse.map((produs) => (
                <Card key={produs.IdProdus} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    
                    <div className="flex items-start justify-between pt-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {produs.Denumire}
                        </CardTitle>
                        {isExpired(produs.DataExpirare) && (
  <div className="flex items-center gap-2 text-red-600 text-sm font-medium mt-1">
    <AlertTriangle size={16} />
    Acest produs a expirat
  </div>
)}
                        <p className="text-emerald-600 text-sm leading-relaxed">
                          {produs.Descriere}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl">
                        <ShoppingBag size={16} className="text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">
                          {produs.STOC[0]?.Cant_Disp ?? 0} buc
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price Section */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl">
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">Preț inițial</p>
                        <p className="text-2xl font-bold text-emerald-800">
                          {Number(produs.Pret_Initial).toFixed(2)} RON
                        </p>
                      </div>
                      </div>
                      {produs.OFERTA.length > 0 && (
                        <div className="text-right">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white mb-2">
                            -{produs.OFERTA[0].Reducere} RON
                          </Badge>
                          <p className="text-lg font-bold text-green-600">
                            {(Number(produs.Pret_Initial) - produs.OFERTA[0].Reducere).toFixed(2)} RON
                          </p>
                        </div>
                        
                      )}
                      {produs.OFERTA.length > 0 && (
  <div className="space-y-2">
    {getOfferStatus(produs.OFERTA[0]) === 'expired' && (
      <Button
        variant="outline"
        className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 mb-2"
        onClick={() => setReactiveProdus(produs)}
      >
        <Star size={16} className="mr-2" />
        Reactivează Ofertă
      </Button>
      
    )}

    <div className="flex items-center gap-2">
      {getOfferStatus(produs.OFERTA[0]) === 'expired' ? (
        <>
          <AlertTriangle size={16} className="text-red-500" />
          <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border border-red-300">
            Ofertă expirată
          </Badge>
        </>
      ) : (
        <>
          <CheckCircle size={16} className="text-green-500" />
          <Badge className="bg-green-500 text-white text-xs">
            Ofertă activă
          </Badge>
        </>
      )}
    </div>

    <div className="text-xs text-emerald-600">
      <div className="flex items-center gap-2 mb-1">
        <Calendar size={14} />
        <span>Început: {formatDateTime(produs.OFERTA[0].DataInceput)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} />
        <span>Sfârșit: {formatDateTime(produs.OFERTA[0].DataSfarsit)}</span>
      </div>
    </div>
  </div>
)}


                    {/* Dates Info */}
                    {/* Dates Info */}
<div className="space-y-2 p-3 bg-gray-50/50 rounded-xl">
  <div className="text-xs text-gray-600">
    <p><strong>Produs:</strong> {formatDateTime(produs.DataProducere)}</p>
    <p><strong>Expiră:</strong> {formatDateTime(produs.DataExpirare)}</p>
<p><strong>Stoc adăugat la:</strong> {produs.STOC[0]?.DataValab ? formatDateTime(produs.STOC[0].DataValab) : '—'}</p>
  </div>
</div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => modificaProdus(produs)}
                        variant="outline"
                        className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Edit size={16} className="mr-2" />
                        Modifică
                      </Button>
                      <Button
                        onClick={() => stergeProdus(produs.IdProdus)}
                        variant="outline"
                        className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Șterge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editProdus} onOpenChange={(open) => {
  if (!open) setEditProdus(null);
}}>

<DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border border-emerald-200 p-10 md:p-12 rounded-3xl space-y-10 shadow-xl">
          
            <DialogTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-3">
              <Edit size={24} className="text-emerald-600" />
              Modifică Produs Sustenabil
            </DialogTitle>
          

          {editProdus && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Denumire Produs
                  </label>
                  <Input
  value={editProdus.Denumire}
  // Aici adăugăm tipul pentru evenimentul onChange
  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditProdus({ ...editProdus, Denumire: e.target.value })}
  className="border-emerald-200 focus:border-emerald-500"
  placeholder="Denumire"
/>

                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Preț Inițial (RON)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editProdus.Pret_Initial}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditProdus({ ...editProdus, Pret_Initial: Number(e.target.value) })}
                    className="border-emerald-200 focus:border-emerald-500"
                    placeholder="Preț"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Descriere
                </label>
                <Textarea
  value={editProdus.Descriere}
  // Aici specificăm tipul pentru evenimentul onChange
  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditProdus({ ...editProdus, Descriere: e.target.value })}
  className="border-emerald-200 focus:border-emerald-500"
  placeholder="Descriere"
  rows={3}
/>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Data Producere
                  </label>
                  <Input
  type="datetime-local"
  value={editProdus.DataProducere ? toLocalDatetimeValue(editProdus.DataProducere) : ""}
  onChange={(e: ChangeEvent<HTMLInputElement>) =>
    setEditProdus({ ...editProdus, DataProducere: e.target.value })
  }
  min={now}
/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Data Expirare
                  </label>
                  <Input
  type="datetime-local"
  value={editProdus.DataExpirare? toLocalDatetimeValue(editProdus.DataExpirare) : ""}
  onChange={(e: ChangeEvent<HTMLInputElement>) =>
    setEditProdus({ ...editProdus, DataExpirare: e.target.value })
  }
  min={now}
/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Cantitate Disponibilă
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editProdus.STOC?.[0]?.Cant_Disp || 0}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditProdus({
                        ...editProdus,
                        STOC: [{ ...editProdus.STOC[0], Cant_Disp: Number(e.target.value) }],
                      })
                    }
                    className="border-emerald-200 focus:border-emerald-500"
                    placeholder="Cantitate"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl space-y-4">
                <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                  <Star size={18} />
                  Configurare Ofertă Specială
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Reducere (RON)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={editProdus.OFERTA?.[0]?.Reducere || 0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEditProdus({
                          ...editProdus,
                          OFERTA: [{
                            ...editProdus.OFERTA?.[0],
                            Reducere: Number(e.target.value),
                            DataInceput: editProdus.OFERTA?.[0]?.DataInceput || '',
                            DataSfarsit: editProdus.OFERTA?.[0]?.DataSfarsit || '',
                          }],
                        })
                      }
                      className="border-emerald-200 focus:border-emerald-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Data Început
                    </label>
                    <Input
  type="datetime-local"
  value={
    editProdus.OFERTA?.[0]?.DataInceput
      ? toLocalDatetimeValue(editProdus.OFERTA[0].DataInceput)
      : ''
  }
  onChange={(e: ChangeEvent<HTMLInputElement>) =>
    setEditProdus({
      ...editProdus,
      OFERTA: [{
        ...editProdus.OFERTA?.[0],
        Reducere: editProdus.OFERTA?.[0]?.Reducere || 0,
        DataInceput: e.target.value,
        DataSfarsit: editProdus.OFERTA?.[0]?.DataSfarsit || '',
      }],
    })
  }
  min={now}
/>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Data și Ora Sfârșit
                    </label>
                    <Input
  type="datetime-local"
  value={
    editProdus.OFERTA?.[0]?.DataSfarsit
      ? toLocalDatetimeValue(editProdus.OFERTA[0].DataSfarsit)
      : ''
  }
  onChange={(e: ChangeEvent<HTMLInputElement>) =>
    setEditProdus({
      ...editProdus,
      OFERTA: [{
        ...editProdus.OFERTA?.[0],
        Reducere: editProdus.OFERTA?.[0]?.Reducere || 0,
        DataInceput: editProdus.OFERTA?.[0]?.DataInceput || '',
        DataSfarsit: e.target.value, // aici e diferența
      }],
    })
  }
  className="border-emerald-200 focus:border-emerald-500"
  min={now}
/>

                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-emerald-200">
                <Button
                  variant="outline"
                  onClick={() => setEditProdus(null)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Anulează
                </Button>
                <Button
                  onClick={salveazaModificari}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Salvează Modificările
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!reactiveProdus} onOpenChange={() => setReactiveProdus(null)}>
  <DialogContent className="w-full max-w-lg bg-white">
    <DialogTitle className="text-lg font-semibold text-yellow-700">
      Reactivează ofertă pentru {reactiveProdus?.Denumire}
    </DialogTitle>

    <div className="space-y-4 mt-4">
      <div>
        <label>Reducere (RON)</label>
        <Input
          type="number"
          min="0"
          value={reactiveData.Reducere}
          onChange={(e) =>
            setReactiveData({ ...reactiveData, Reducere: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <label>Data Început</label>
        <Input
          type="datetime-local"
          value={reactiveData.DataInceput}
          onChange={(e) =>
            setReactiveData({ ...reactiveData, DataInceput: e.target.value })
          }
          min={now}
        />
      </div>

      <div>
        <label>Data Sfârșit</label>
        <Input
          type="datetime-local"
          value={reactiveData.DataSfarsit}
          onChange={(e) =>
            setReactiveData({ ...reactiveData, DataSfarsit: e.target.value })
          }
          min={now}
        />
      </div>
      <div>
  <label>Data Producere</label>
  <Input
    type="datetime-local"
    value={reactiveData.DataProducere}
    onChange={(e) =>
      setReactiveData({ ...reactiveData, DataProducere: e.target.value })
    }
    min={now}
  />
</div>

<div>
  <label>Data Expirare</label>
  <Input
    type="datetime-local"
    value={reactiveData.DataExpirare}
    onChange={(e) =>
      setReactiveData({ ...reactiveData, DataExpirare: e.target.value })
    }
    min={now}
  />
</div>


      <div>
        <label>Stoc disponibil</label>
        <Input
          type="number"
          min="0"
          value={reactiveData.Cant_Disp}
          onChange={(e) =>
            setReactiveData({ ...reactiveData, Cant_Disp: Number(e.target.value) })
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={async () => {
            const res = await fetch('/api/reactiveaza-oferta', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                IdProdus: reactiveProdus?.IdProdus,
                ...reactiveData
              })
            });

            if (res.ok) {
              alert("Ofertă reactivată!");
              setReactiveProdus(null);
              window.location.reload();
            } else {
              const err = await res.json();
              alert(err.mesaj || "Eroare la reactivare");
            }
          }}
          className="bg-yellow-500 text-white"
        >
          Reactivează
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

      {/* Impact Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Contribuția Ta la Sustenabilitate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Leaf size={24} className="text-emerald-100" />
                </div>
              </div>
              <p className="font-semibold">Reduci Risipa</p>
              <p className="text-emerald-100 text-sm">Fiecare produs salvat contează</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Heart size={24} className="text-emerald-100" />
                </div>
              </div>
              <p className="font-semibold">Protejezi Planeta</p>
              <p className="text-emerald-100 text-sm">Un viitor mai verde pentru toți</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Users size={24} className="text-emerald-100" />
                </div>
              </div>
              <p className="font-semibold">Creezi Impact</p>
              <p className="text-emerald-100 text-sm">Comunitate sustenabilă</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}