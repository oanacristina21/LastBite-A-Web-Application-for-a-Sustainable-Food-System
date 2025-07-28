import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Package, Upload, CheckCircle, Tag, Calendar, ShoppingBag, Heart, Leaf, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import  Input  from '@/components/ui/input';
import  Textarea  from '@/components/ui/textarea';
import Select from 'react-select';
import { useRouter } from 'next/router';

type Categorie = {
  IdCategorie: number;
  Denumire: string;
};

type Preferinta = {
  IdPreferintaDietetica: number;
  Denumire: string;
};

export default function AddProdus() {
  const [form, setForm] = useState({
    Denumire: '',
    Descriere: '',
    Pret_Initial: '',
    DataProducere: '',
    DataExpirare: '',
    IdCategorie: '',
    Cant_Disp: '',
    Preferinte: [] as number[],
  });
      const now = new Date().toISOString().slice(0, 16);


  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [preferinte, setPreferinte] = useState<Preferinta[]>([]);
  const [idUtilizator, setIdUtilizator] = useState<number | null>(null);
  const [poza, setPoza] = useState<File | null>(null);
  const router = useRouter();


  useEffect(() => {
    axios.get('/api/auth/me').then(res => setIdUtilizator(res.data.id));
    axios.get('/api/categorii').then(res => setCategorii(res.data));
    axios.get('/api/preferinte').then(res => setPreferinte(res.data));
  }, []);

  const handleCheckbox = (id: number) => {
    setForm(f => ({
      ...f,
      Preferinte: f.Preferinte.includes(id)
        ? f.Preferinte.filter(pid => pid !== id)
        : [...f.Preferinte, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



// Validare câmpuri numerice
if (parseFloat(form.Pret_Initial) < 0) {
  return alert('Prețul nu poate fi negativ.');
}

if (parseInt(form.Cant_Disp) < 0) {
  return alert('Cantitatea disponibilă nu poate fi negativă.');
}


    const dtProdUtc = `${form.DataProducere}:00`;
    const dtExpUtc = `${form.DataExpirare}:00`;

    const azi = new Date();
azi.setHours(0, 0, 0, 0); // ora 00:00 a zilei curente

const dataProducere = new Date(`${form.DataProducere}:00`);
const dataExpirare = new Date(`${form.DataExpirare}:00`);

if (dataProducere < azi) {
  alert("Data de producere nu poate fi anterioară zilei de azi.");
  return;
}

if (dataExpirare <= dataProducere) {
  alert("Data de expirare trebuie să fie după data de producere.");
  return;
}


    const fd = new FormData();
    fd.append("Denumire", form.Denumire);
    fd.append("Descriere", form.Descriere);
    fd.append("Pret_Initial", form.Pret_Initial);
    fd.append("DataProducere", dtProdUtc);
    fd.append("DataExpirare", dtExpUtc);
    fd.append("IdCategorie", form.IdCategorie);
    fd.append("Cant_Disp", form.Cant_Disp);
    fd.append("Preferinte", JSON.stringify(form.Preferinte));
    fd.append("IdRestaurant", String(idUtilizator));
    
    if (poza) fd.append("poza", poza);

    try {
      await axios.post('/api/produse', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Produs adăugat cu succes!");
      router.push('/restaurant-dashboard');
      setForm({
        Denumire: '',
        Descriere: '',
        Pret_Initial: '',
        DataProducere: '',
        DataExpirare: '',
        IdCategorie: '',
        Cant_Disp: '',
        Preferinte: [],
      });
      setPoza(null);
    } catch (err) {
      console.error(err);
      alert("Eroare la adăugare produs.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Plus size={48} className="text-emerald-100" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Adaugă Produs Nou
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Creează un nou produs sustenabil și contribuie la reducerea risipei alimentare!
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
            <CardTitle className="text-3xl font-bold text-emerald-800 flex items-center gap-3 pt-2">
              <Package size={32} className="text-emerald-600" />
              Detalii Produs Sustenabil
            </CardTitle>
            <p className="text-emerald-600 text-lg">
              Completează toate informațiile pentru a adăuga un produs nou în oferta ta
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <Tag size={20} />
                  Informații de Bază
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Denumire Produs *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Pizza Margherita"
                      value={form.Denumire}
                      onChange={e => setForm(f => ({ ...f, Denumire: e.target.value }))}
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Preț Inițial (RON) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.Pret_Initial}
                      onChange={e => setForm(f => ({ ...f, Pret_Initial: e.target.value }))}
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-700">
                    Descriere
                  </label>
                  <Textarea
                    placeholder="Descrie produsul tău: ingrediente, mod de preparare, caracteristici speciale..."
                    value={form.Descriere}
                    onChange={e => setForm(f => ({ ...f, Descriere: e.target.value }))}
                    className="border-emerald-200 focus:border-emerald-500"
                    rows={4}
                  />
                </div>
              </div>

              {/* Category and Stock */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <ShoppingBag size={20} />
                  Categorie și Stoc
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Categorie *
                    </label>
                    <Select
                      value={form.IdCategorie ? { value: String(form.IdCategorie), label: categorii.find(c => String(c.IdCategorie) === String(form.IdCategorie))?.Denumire } : null}
                      onChange={(selectedOption) => setForm(f => ({ ...f, IdCategorie: selectedOption?.value ?? '' }))}
                      options={categorii.map(c => ({ value: String(c.IdCategorie), label: c.Denumire }))}
                      placeholder="Selectează categoria..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Cantitate Disponibilă *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Ex: 10, 25, 50..."
                      value={form.Cant_Disp}
                      onChange={e => setForm(f => ({ ...f, Cant_Disp: e.target.value }))}
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <Calendar size={20} />
                  Date Importante
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Data Producere
                    </label>
                    <Input
  type="datetime-local"
  value={form.DataProducere}
  onChange={e => setForm(f => ({ ...f, DataProducere: e.target.value }))}
  className="border-emerald-200 focus:border-emerald-500"
/>

                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Data Expirare *
                    </label>
                    <Input
                      type="datetime-local"
                      value={form.DataExpirare}
                      onChange={e => setForm(f => ({ ...f, DataExpirare: e.target.value }))}
                      className="border-emerald-200 focus:border-emerald-500"
                      min={now}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <Upload size={20} />
                  Imagine Produs
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-700">
                    Încarcă o imagine
                  </label>
                  <div className="p-6 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-emerald-600 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPoza(e.target.files?.[0] || null)}
                        className="border-0 bg-transparent text-center cursor-pointer"
                      />
                      <p className="text-sm text-emerald-600 mt-2">
                        Formate acceptate: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <Heart size={20} />
                  Preferințe Dietetice
                </h3>
                
                <div className="p-6 bg-emerald-50/50 rounded-xl">
                  <p className="text-emerald-700 mb-4">Selectează preferințele dietetice care se aplică produsului tău:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {preferinte.map((p) => (
                      <div key={p.IdPreferintaDietetica} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={form.Preferinte.includes(p.IdPreferintaDietetica)}
                          onChange={() => handleCheckbox(p.IdPreferintaDietetica)}
                          className="border-emerald-300"
                        />
                        <label 
                          htmlFor={`pref-${p.IdPreferintaDietetica}`}
                          className="text-sm font-medium text-emerald-700 cursor-pointer"
                        >
                          {p.Denumire}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-emerald-200">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CheckCircle size={20} className="mr-2" />
                  Adaugă Produsul
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Impact Message */}
        <div className="mt-12 text-center">
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-200 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <Leaf size={24} className="text-emerald-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">Faci o diferență!</h3>
            <p className="text-emerald-600">
              Fiecare produs adăugat contribuie la reducerea risipei alimentare și la crearea unei comunități mai sustenabile.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Impact Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Impactul Tău Pozitiv</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-3 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf size={24} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Reduci Risipa</p>
              <p className="text-emerald-100 text-sm">Salvezi mâncarea de la a fi aruncată</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-3 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Protejezi Planeta</p>
              <p className="text-emerald-100 text-sm">Contribui la un viitor sustenabil</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="p-3 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Ajuți Comunitatea</p>
              <p className="text-emerald-100 text-sm">Oferi acces la mâncare de calitate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}