import { Package, ShoppingCart, User, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link"; // adaugă sus
import { GetServerSideProps } from "next";
import nookies from "nookies";
import jwt from "jsonwebtoken";


type ComandaRecente = {
  id: number;
  nr: string;
  data: string;
  status: string;
  total: number;
};

const Index = () => {
  const [statistici, setStatistici] = useState({
    totalComenzi: 0,
    comenziActive: 0,
    mancareSalvata: 0,
  });

  const [comenziRecente, setComenziRecente] = useState<ComandaRecente[]>([]);


  useEffect(() => {
    fetch("/api/comenzi-recente")
      .then((res) => res.json())
      .then((data) => setComenziRecente(data))
      .catch(() => console.warn("Nu s-au putut încărca comenzile recente."));

    fetch("/api/statistici-utilizator")
      .then((res) => res.json())
      .then((data) => setStatistici(data))
      .catch(() => console.warn("Eroare la statistici."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      

      {/* Header Section */}
<div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Package size={36} className="text-emerald-100" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                Dashboard Personal
              </h1>
              <p className="text-emerald-100 text-lg font-medium">Descopera cele mai bune reduceri din apropriere</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Total Comenzi</h3>
              <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors duration-200">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">{statistici.totalComenzi}</div>
            <p className="text-sm text-emerald-600 mt-1">Ultimele comenzi</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Comenzi Active</h3>
              <div className="p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors duration-200">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">{statistici.comenziActive}</div>
            <p className="text-sm text-emerald-600 mt-1">In procesare</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Economii Totale</h3>
              <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors duration-200">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">
              {statistici.mancareSalvata.toFixed(2)} RON
            </div>
            <p className="text-sm text-emerald-600 mt-1">Impact pozitiv</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-1">Comenzile Mele Recente</h2>
              <p className="text-emerald-600">Ultimele tale contributii la salvarea mancarii</p>
            </div>
           <Link 
  href="/comenzile-mele"
  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
>
  <span>Vezi toate</span>
  <ArrowRight className="ml-2 h-4 w-4" />
</Link>
          </div>

          <div className="space-y-3">
            {comenziRecente.length > 0 ? (
              comenziRecente.map((comanda) => (
                <div
                  key={comanda.id}
                  className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl bg-gradient-to-r from-white to-emerald-50/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-800">Comanda #{comanda.nr}</p>
                      <p className="text-sm text-emerald-600">
                        {new Date(comanda.data).toLocaleDateString('ro-RO', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                        ${
                          comanda.status === "Livrata"
                            ? "bg-emerald-100 text-emerald-800"
                            : comanda.status === "In procesare"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {comanda.status}
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-800">{comanda.total} RON</p>
                      <p className="text-xs text-emerald-600">economisiti</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-emerald-100 rounded-xl mb-4 inline-block">
                  <Package className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-emerald-600 font-medium">Nu ai comenzi recente</p>
                <p className="text-emerald-500 text-sm">Descoperă ofertele noastre și fă prima comandă!</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl">
  <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl shadow-xl px-6 py-5">
    <h3 className="text-lg font-semibold text-emerald-800 mb-5">Acțiuni Rapide</h3>
    <Link
      href="/profil"
      className="w-full flex items-center justify-between px-4 py-3 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-300 text-base"
    >
      <div className="flex items-center">
        <User className="h-5 w-5 mr-3" />
        Setări Cont
      </div>
      <ArrowRight className="h-5 w-5" />
    </Link>
  </div>
</div>


<div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-lg p-6 text-white">
  <h3 className="text-lg font-semibold mb-3">Suport & Comunitate</h3>
  <p className="text-emerald-100 mb-4 text-sm">
    Faci parte dintr-o comunitate care lupta impotriva risipei alimentare. Trimite-ne un mesaj direct:
  </p>
  <form
    className="space-y-3"
    onSubmit={async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      alert(result.mesaj || 'Mesaj trimis!');
      form.reset();
    }}
  >
    <input
      name="subject"
      required
      className="w-full px-4 py-2 rounded-xl text-emerald-900 bg-white placeholder-emerald-400"
      placeholder="Subiect"
    />
    <textarea
      name="message"
      required
      className="w-full px-4 py-2 rounded-xl text-emerald-900 bg-white placeholder-emerald-400"
      placeholder="Scrie mesajul tău..."
      rows={4}
    />
    <button
      type="submit"
      className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-xl transition-all duration-300 font-semibold"
    >
      Trimite mesajul
    </button>
  </form>
</div>

        
        </div>
      </main>
    </div>
  );
};

export default Index;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret123");
    return { props: {} };
  } catch {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
};