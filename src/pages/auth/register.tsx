import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, ShoppingCart, Target, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import  Input  from '@/components/ui/input';

type Localitate = {
  IdLocalitate: number;
  Denumire: string;
  Judet: string;
};

export default function Register() {
  const router = useRouter();
  const [tip, setTip] = useState<'client' | 'restaurant'>('client');
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nrTelefon, setNrTelefon] = useState('');
  const [idLocalitate, setIdLocalitate] = useState('');
  const [localitati, setLocalitati] = useState<Localitate[]>([]);
  const [nume, setNume] = useState('');
  const [prenume, setPrenume] = useState('');
  const [denumireRest, setDenumireRest] = useState('');
  const [adresaRest, setAdresaRest] = useState('');
  const [mesajEroare, setMesajEroare] = useState('');


  useEffect(() => {
    fetch('/api/localitati')
      .then((res) => res.json())
      .then((data) => setLocalitati(data))
      .catch(() => alert('Eroare la încarcarea localitatilor.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMesajEroare('');

  if (!email || !parola || !nrTelefon || !idLocalitate) {
    setMesajEroare('Te rugăm să completezi toate câmpurile obligatorii.');
    return;
  }

  if (tip === 'client' && (!nume || !prenume)) {
    setMesajEroare('Introdu numele și prenumele.');
    return;
  }

  if (tip === 'restaurant' && (!denumireRest || !adresaRest)) {
    setMesajEroare('Introdu numele și adresa restaurantului.');
    return;
  }

  const payload = {
    email,
    parola,
    nr_telefon: nrTelefon,
    IdLocalitate: parseInt(idLocalitate),
    tip,
    ...(tip === 'client' ? { nume, prenume } : { denumireRest, adresaRest }),
  };

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    router.push('/auth/login');
  } else {
    const data = await res.json();
    setMesajEroare(data.mesaj || 'Eroare la înregistrare.');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield size={40} className="text-emerald-100" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Alătură-te misiunii noastre!
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Creează-ți contul și începe să salvezi mâncarea împreună cu noi!
          </p>
        </div>
      </div>

      {/* Register Section */}
      <div className="flex items-center justify-center px-6 py-12 -mt-6 relative z-10">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-emerald-800 mb-2">
              Creează cont nou
            </CardTitle>
            <p className="text-emerald-600">
              Completează formularul pentru a te alătura comunității noastre
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {mesajEroare && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
    {mesajEroare}
  </div>
)}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-700">
                  Tip cont
                </label>
                <div className="relative">
                  <Shield size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <select
                    value={tip}
                    onChange={(e) => setTip(e.target.value as 'client' | 'restaurant')}
                    className="pl-10 w-full h-12 border border-emerald-200 focus:border-emerald-500 rounded-md bg-white"
                  >
                    <option value="client">Client</option>
                    <option value="restaurant">Restaurant</option>
                  </select>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-700">
                  Adresa de email
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-500 h-12 w-full"
                    placeholder="nume@exemplu.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-700">
                  Parola
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={parola}
                    onChange={(e) => setParola(e.target.value)}
                    className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 h-12 w-full"
                    placeholder="Introdu parola"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-700">
                  Număr telefon
                </label>
                <Input
                  type="text"
                  value={nrTelefon}
                  onChange={(e) => setNrTelefon(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 h-12 w-full"
                  placeholder="0700000000"
                  required
                />
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-700">
                  Localitatea
                </label>
                <select
                  value={idLocalitate}
                  onChange={(e) => setIdLocalitate(e.target.value)}
                  className="w-full h-12 border border-emerald-200 focus:border-emerald-500 rounded-md bg-white"
                  required
                >
                  <option value="">Selectează localitatea</option>
                  {localitati.map((loc) => (
                    <option key={loc.IdLocalitate} value={loc.IdLocalitate}>
                      {loc.Denumire} ({loc.Judet})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client specific fields */}
              {tip === 'client' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Nume
                    </label>
                    <Input
                      type="text"
                      value={nume}
                      onChange={(e) => setNume(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500 h-12 w-full"
                      placeholder="Nume"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Prenume
                    </label>
                    <Input
                      type="text"
                      value={prenume}
                      onChange={(e) => setPrenume(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500 h-12 w-full"
                      placeholder="Prenume"
                      required
                    />
                  </div>
                </>
              )}

              {/* Restaurant specific fields */}
              {tip === 'restaurant' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Denumire restaurant
                    </label>
                    <Input
                      type="text"
                      value={denumireRest}
                      onChange={(e) => setDenumireRest(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500 h-12 w-full"
                      placeholder="Numele restaurantului"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-700">
                      Adresă
                    </label>
                    <Input
                      type="text"
                      value={adresaRest}
                      onChange={(e) => setAdresaRest(e.target.value)}
                      className="border-emerald-200 focus:border-emerald-500 h-12 w-full"
                      placeholder="Adresa restaurantului"
                      required
                    />
                  </div>
                </>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 text-lg font-semibold"
              >
                <ArrowRight size={20} className="mr-2" />
                Creează contul
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-6">Ce vei câștiga?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <ShoppingCart size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Acces La Oferte</p>
              <p className="text-emerald-100 text-sm">Descoperă mâncare la prețuri reduse</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <Target size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Recomandări Personalizate</p>
              <p className="text-emerald-100 text-sm">Produse adaptate gusturilor tale</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <Leaf size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Impact Pozitiv</p>
              <p className="text-emerald-100 text-sm">Contribui la reducerea risipei alimentare</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}