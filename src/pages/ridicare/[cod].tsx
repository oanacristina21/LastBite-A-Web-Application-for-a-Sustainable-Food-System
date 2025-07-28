import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle, Clock, Package, QrCode, AlertCircle } from 'lucide-react';

export default function VerificareComandaPage() {
  const router = useRouter();
  const { cod } = router.query;
  const [loading, setLoading] = useState(true);

  const { role } = useUser(); 

  interface Comanda {
    NrComanda: string;
    StatusComanda: string;
    CodRidicare: string;
  }

  const [comanda, setComanda] = useState<Comanda | null>(null);

  useEffect(() => {
    if (!cod) return;
    fetch(`/api/verificare-comanda?cod=${cod}`)
      .then((res) => res.json())
      .then((data) => {
        setComanda(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cod]);

  const finalizeazaComanda = async () => {
    const response = await fetch(`/api/finalizare-comanda?cod=${cod}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    alert(data.mesaj); 
    if (response.ok && role === 'restaurant') {
    router.push('/comenzi');
  }
  };
  
  console.log('Role:', role);
  console.log('Status Comanda:', comanda?.StatusComanda);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'În pregătire':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'Gata de Ridicare':
        return <Package className="w-6 h-6 text-green-500" />;
      case 'Finalizată':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'În pregătire':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Gata de Ridicare':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Finalizată':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-lg font-medium text-gray-700">Se verifică comanda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!comanda) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Comandă inexistentă</h2>
            <p className="text-gray-600">Codul introdus nu este valid sau comanda nu există în sistem.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Comanda #{comanda.NrComanda}
                </h1>
                <p className="text-emerald-100">Detalii comandă</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(comanda.StatusComanda)}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Status comandă</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(comanda.StatusComanda)}`}>
                      {comanda.StatusComanda}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cod ridicare */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 rounded-full p-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cod ridicare</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
                    {comanda.CodRidicare}
                  </p>
                </div>
              </div>
            </div>

            {/* Buton finalizare */}
            {role === 'restaurant' && comanda.StatusComanda === 'Gata de Ridicare' && (
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={finalizeazaComanda}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Finalizează comanda</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {comanda.StatusComanda === 'Gata de Ridicare' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Comanda este gata de ridicare!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}