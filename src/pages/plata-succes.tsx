import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, AlertCircle, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';


export default function PlataSucces() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  useEffect(() => {
  if (status === 'success') {
    const timeout = setTimeout(() => {
      router.push('/comenzile-mele'); // sau ruta ta exactă
    }, 3000); // așteaptă 3 secunde

    return () => clearTimeout(timeout);
  }
}, [status]);



  type ProdusCos = {
    IdProdus: number;
    Denumire: string;
    pret: number;
    cantitate: number;
  };

  useEffect(() => {
    const finalizeaza = async () => {
      const cosLocal = localStorage.getItem('cos');
      if (!cosLocal) {
        setStatus('error');
        return;
      }

      try {
        const cos = JSON.parse(cosLocal);

        const produse = (cos as ProdusCos[]).map((p) => ({
          id: p.IdProdus,
          cantitate: p.cantitate,
          pret: p.pret,
          denumire: p.Denumire,
        }));

        const res = await fetch('/api/finalizare-comanda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produse }),
        });

        if (!res.ok) {
  const eroare = await res.json();
  console.error("Eroare la API:", eroare);
  throw new Error(eroare.mesaj || 'Eroare la finalizare');
}


        localStorage.removeItem('cos');
        setStatus('success');
      } catch (error) {
        console.error('Finalizare eșuată:', error);
        setStatus('error');
      }
    };

    finalizeaza();
    
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                <Loader2 size={48} className="text-emerald-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-800 mb-4">Se finalizează comanda...</h1>
              <p className="text-emerald-600 leading-relaxed">
                Așteptăm confirmarea plății tale
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="p-6 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-6 inline-block">
                <CheckCircle size={48} className="text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-emerald-800 mb-4">Plata a fost confirmată!</h1>
              <p className="text-emerald-600 leading-relaxed mb-6">
                Comanda ta a fost înregistrată cu succes. Mulțumim că salvezi mâncarea!
              </p>
              <div className="flex items-center justify-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <Leaf size={16} className="text-emerald-600" />
                <span className="text-emerald-700 text-sm font-medium">Impact pozitiv pentru mediu</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="p-6 bg-red-100 rounded-2xl mb-6 inline-block">
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-800 mb-4">Eroare la procesare</h1>
              <p className="text-red-600 leading-relaxed">
                Din păcate, comanda nu a putut fi finalizată. Contactează suportul sau încearcă din nou.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}