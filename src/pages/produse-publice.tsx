"use client";

import { useEffect, useState } from "react";
import { Clock, Package, Plus, MapPin, Filter, Search, ShoppingCart, Leaf, Heart, Star } from "lucide-react";
import ProductModal from '@/components/ProductModal';
import { useRouter } from 'next/router';

// Simple date formatting function
const formatOraRomaniei = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

type Oferta = {
  Reducere: number;
  DataSfarsit: string;
};

type ProdusPublic = {
  IdProdus: number;
  Denumire: string;
  Pret_Initial: number;
  OFERTA: Oferta[];
  Preferinte?: string[];
  Imagine?: string;
  CantitateDisponibila: number;
  IdRestaurant: number;
  RESTAURANT: {
    Denumire: string;
    Latitude?: number;
    Longitude?: number;
  };
  DistantaKm?: number;
};

type ItemCos = {
  IdProdus: number;
  Denumire: string;
  pret: number;
  cantitate: number;
  idRestaurant: number;
  Cant_Disp: number;
  restaurantName?: string;
};
type User = {
  Email: string;
};

export default function OfertePage() {
  const [produse, setProduse] = useState<ProdusPublic[]>([]);
  const [cos, setCos] = useState<ItemCos[]>([]);
  const [loading, setLoading] = useState(true);
  const [pretMin, setPretMin] = useState('');
  const [pretMax, setPretMax] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [preferinteDisponibile, setPreferinteDisponibile] = useState<{ IdPreferintaDietetica: number, Denumire: string }[]>([]);
  const [preferinteSelectate, setPreferinteSelectate] = useState<number[]>([]);
  const [categorii, setCategorii] = useState<{ IdCategorie: number, Denumire: string }[]>([]);
  const [categorieSelectata, setCategorieSelectata] = useState<string>('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [adresa, setAdresa] = useState('');
  const [maxDistantaKm, setMaxDistantaKm] = useState(10);
  const [produsSelectat, setProdusSelectat] = useState<null | ProdusPublic>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [restaurante, setRestaurante] = useState<{ IdRestaurant: number; Denumire: string; NrOferteActive: number }[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
const [loadingUser, setLoadingUser] = useState(true);

useEffect(() => {
  fetch('/api/auth/me')
    .then(res => res.ok ? res.json() : null)
    .then(data => setUser(data))
    .catch(() => setUser(null))
    .finally(() => setLoadingUser(false)); // ← termină verificarea
}, []);

useEffect(() => {
  if (!loadingUser && user === null) {
    router.push("/auth/login");
  }
}, [user, loadingUser]);



  // Calculate statistics from current data
  const totalProduse = produse.length;
  const totalReduceri = produse.reduce((sum, p) => sum + (p.OFERTA?.[0]?.Reducere || 0), 0);
  const procentajMediuReducere = produse.length > 0 
    ? Math.round(produse.reduce((sum, p) => {
        const reducere = p.OFERTA?.[0]?.Reducere || 0;
        const procent = (reducere / p.Pret_Initial) * 100;
        return sum + procent;
      }, 0) / produse.length)
    : 0;

  useEffect(() => {
    // Get restaurantId from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const urlRestaurantId = urlParams.get('restaurantId');
    
    if (urlRestaurantId) {
      setRestaurantId(urlRestaurantId);
      incarcaProduse(urlRestaurantId);
    } else {
      incarcaProduse();
    }
  }, []);

  const preiaLocatia = async () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    setUserLat(lat);
    setUserLng(lng);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await res.json();
      const adresaFormatata = data.results?.[0]?.formatted_address || `Lat: ${lat}, Lng: ${lng}`;
      setAdresa(adresaFormatata);
    } catch {
      setAdresa(`Lat: ${lat}, Lng: ${lng}`);
    }
  }, () => {
    alert('Nu am putut obține locația.');
  });
};


  const incarcaProduse = (initialRestaurantId?: string) => {
    setLoading(true);
    const query = new URLSearchParams();

    const selectedRestaurant = initialRestaurantId ?? restaurantId;

    if (categorieSelectata) query.append("categorie", categorieSelectata);
    if (pretMin) query.append("pretMin", pretMin);
    if (pretMax) query.append("pretMax", pretMax);
    if (selectedRestaurant && selectedRestaurant !== "") {
      query.append("restaurantId", selectedRestaurant);
    }

    if (sortDir.startsWith("distanta")) {
      query.append("sortBy", "distanta");
      query.append("sortDir", sortDir.endsWith("asc") ? "asc" : "desc");
    } else {
      query.append("sortBy", "pret");
      query.append("sortDir", sortDir);
    }

    if (userLat && userLng) {
      query.append('lat', userLat.toString());
      query.append('lng', userLng.toString());
      query.append('dist', maxDistantaKm.toString());
    }

    if (preferinteSelectate.length > 0) {
      query.append('preferinte', preferinteSelectate.join(","));
    }

    fetch(`/api/produse-publice?${query.toString()}`)
      .then(res => res.json())
      .then((data: ProdusPublic[]) => {
        setProduse(data);
        setLoading(false);

        const cosLocal: ItemCos[] = JSON.parse(localStorage.getItem("cos") || "[]");
        const cosActualizat = cosLocal.map(item => {
          const produsActual = data.find(p => p.IdProdus === item.IdProdus);
          return produsActual
            ? {
                ...item,
                Cant_Disp: produsActual.CantitateDisponibila,
                restaurantName: produsActual.RESTAURANT?.Denumire || item.restaurantName || "necunoscut",
              }
            : item;
        });

        setCos(cosActualizat);
        localStorage.setItem("cos", JSON.stringify(cosActualizat));
      })
      .catch(() => {
        alert("Eroare la încărcare produse.");
        setLoading(false);
      });
  };

  const adaugaInCos = (produs: ProdusPublic) => {
  if (!user) {
    alert("Trebuie să fii autentificat(ă) pentru a adăuga în coș.");
    
    return;
  }

  const cosActual: ItemCos[] = JSON.parse(localStorage.getItem("cos") || "[]");

  if (cosActual.length > 0 && cosActual[0].idRestaurant !== produs.IdRestaurant) {
    alert("Poți adăuga produse doar de la un singur restaurant în coș.");
    return;
  }

  const pretFinal = produs.Pret_Initial - (produs.OFERTA?.[0]?.Reducere || 0);
  const index = cosActual.findIndex(p => p.IdProdus === produs.IdProdus);

  if (index !== -1) {
    if (cosActual[index].cantitate < cosActual[index].Cant_Disp) {
      cosActual[index].cantitate += 1;
    } else {
      alert(`Ai atins limita stocului disponibil (${cosActual[index].Cant_Disp}) pentru acest produs.`);
      return;
    }
  } else {
    cosActual.push({
      IdProdus: produs.IdProdus,
      Denumire: produs.Denumire,
      pret: pretFinal,
      cantitate: 1,
      idRestaurant: produs.IdRestaurant,
      Cant_Disp: produs.CantitateDisponibila,
      restaurantName: produs.RESTAURANT?.Denumire || "necunoscut"
    });
  }

  localStorage.setItem("cos", JSON.stringify(cosActual));
  setCos(cosActual);
};


  const getCantitateInCos = (idProdus: number) => {
    const item = cos.find(p => p.IdProdus === idProdus);
    return item ? item.cantitate : 0;
  };

  const getTotalCos = () => {
    return cos.reduce((total, item) => total + item.pret * item.cantitate, 0);
  };

  useEffect(() => {
    fetch("/api/categorii")
      .then(res => res.json())
      .then(setCategorii)
      .catch(() => alert("Eroare la încărcarea categoriilor"));
  }, []);

  useEffect(() => {
    fetch("/api/restaurante")
      .then(res => res.json())
      .then((data: { IdRestaurant: number; Denumire: string; NrOferteActive: number }[]) => {
        setRestaurante(data);
      })
      .catch(() => alert("Eroare la încărcarea restaurantelor"));
  }, []);

  useEffect(() => {
    fetch("/api/preferinte")
      .then(res => res.json())
      .then(setPreferinteDisponibile)
      .catch(() => alert("Eroare la încărcarea preferințelor dietetice"));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
            <Package className="text-emerald-600" size={48} />
          </div>
          <p className="text-emerald-600 text-lg font-semibold">Se încarcă ofertele delicioase...</p>
          <p className="text-emerald-500 text-sm mt-2">Pregătim cele mai bune reduceri pentru tine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Package size={36} className="text-emerald-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Oferte Speciale
                </h1>
                <p className="text-emerald-100 text-lg font-medium">Descoperă cele mai bune reduceri din apropiere</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-4 text-base font-semibold backdrop-blur-sm flex items-center gap-2"
            >
              <Filter size={18} />
              Filtre
            </button>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Leaf size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">LastBite - Pentru un viitor sustenabil</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section - More Compact */}
        <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-6 border border-emerald-100 transition-all duration-300 ${showFilters ? 'animate-fade-in' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Preț minim</label>
              <input
                type="number"
                value={pretMin}
                onChange={(e) => setPretMin(e.target.value)}
                className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                placeholder="0 RON"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Preț maxim</label>
              <input
                type="number"
                value={pretMax}
                onChange={(e) => setPretMax(e.target.value)}
                className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
                placeholder="999 RON"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Sortare</label>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
                className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
              >
                <option value="asc">Preț crescător</option>
                <option value="desc">Preț descrescător</option>
                <option value="distanta_asc">Distanță crescătoare</option>
                <option value="distanta_desc">Distanță descrescătoare</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Categorie</label>
              <select
                value={categorieSelectata}
                onChange={(e) => setCategorieSelectata(e.target.value)}
                className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
              >
                <option value="">Toate categoriile</option>
                {categorii.map(c => (
                  <option key={c.IdCategorie} value={c.IdCategorie}>{c.Denumire}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Restaurant</label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200 bg-white/80"
              >
                <option value="">Toate restaurantele</option>
                {restaurante.map(r => (
                  <option key={r.IdRestaurant} value={r.IdRestaurant}>
                    {r.Denumire}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Section - Compact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-800">Locație</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={preiaLocatia}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
                >
                  <MapPin size={16} />
                  Obține locația
                </button>
                {userLat && userLng && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={maxDistantaKm}
                      onChange={(e) => setMaxDistantaKm(Number(e.target.value))}
                      className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md whitespace-nowrap">
                      {maxDistantaKm} km
                    </span>
                  </div>
                )}
              </div>
              {adresa && (
                <p className="text-xs text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                  <MapPin size={12} />
                  {adresa}
                </p>
              )}
            </div>
          </div>

          {/* Dietary Preferences - Compact */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-emerald-800 mb-2">Preferințe dietetice</label>
            <div className="flex flex-wrap gap-2">
              {preferinteDisponibile.map(pref => (
                <label key={pref.IdPreferintaDietetica} className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 cursor-pointer transition-all duration-200 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={preferinteSelectate.includes(pref.IdPreferintaDietetica)}
                    onChange={(e) => {
                      setPreferinteSelectate(prev =>
                        e.target.checked
                          ? [...prev, pref.IdPreferintaDietetica]
                          : prev.filter(id => id !== pref.IdPreferintaDietetica)
                      );
                    }}
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3"
                  />
                  {pref.Denumire}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => incarcaProduse()}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-6 text-sm font-semibold flex items-center gap-2"
            >
              <Search size={16} />
              Aplică filtre
            </button>
          </div>
        </div>

        {/* Shopping Cart Summary */}
        {cos.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl overflow-hidden shadow-lg mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold text-base">
                      {cos.reduce((total, item) => total + item.cantitate, 0)} produse în coș
                    </p>
                    <p className="text-emerald-600 text-sm">Total: <span className="font-bold text-lg text-emerald-700">{getTotalCos().toFixed(2)} RON</span></p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/cos')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-4 text-sm font-semibold"
                >
                  Vezi coșul
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Section - Compact Grid */}
        {produse.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-md mx-auto">
              <div className="p-4 bg-emerald-100 rounded-xl mb-4 inline-block">
                <Package size={48} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-3">Nu sunt oferte disponibile</h3>
              <p className="text-emerald-600">
                Încearcă să modifici filtrele sau revino mai târziu pentru oferte noi!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produse.map((produs) => {
              const pretFinal = produs.Pret_Initial - (produs.OFERTA?.[0]?.Reducere || 0);
              const reducereProcentaj = produs.OFERTA?.[0]
                ? Math.round((produs.OFERTA[0].Reducere / produs.Pret_Initial) * 100)
                : 0;
              const cantitateInCos = getCantitateInCos(produs.IdProdus);

              return (
                <div key={produs.IdProdus} className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 hover:border-emerald-200 hover:-translate-y-1">
                  {/* ... keep existing code (product card content) */}
                  <div className="relative h-48 overflow-hidden">
                    {produs.CantitateDisponibila < 5 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg z-10 animate-pulse flex items-center gap-1">
                        <Clock size={12} />
                        Ultimele
                      </div>
                    )}
                    
                    {produs.Imagine ? (
                      <img 
                        src={produs.Imagine} 
                        alt={produs.Denumire} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-emerald-400" />
                      </div>
                    )}
                    
                    {produs.OFERTA?.[0] && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                        -{reducereProcentaj}%
                      </div>
                    )}

                    {produs.OFERTA?.[0] && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatOraRomaniei(produs.OFERTA[0].DataSfarsit)}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3
                        className="text-lg font-bold text-emerald-800 hover:text-emerald-600 cursor-pointer transition-colors duration-200 line-clamp-2 mb-2"
                        onClick={() => setProdusSelectat(produs)}
                      >
                        {produs.Denumire}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-emerald-600 mb-1">
                        <MapPin size={12} />
                        <span className="truncate">{produs.RESTAURANT.Denumire}</span>
                      </div>

                      {typeof produs.DistantaKm === 'number' && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block items-center gap-1">
                          <MapPin size={10} />
                          La {produs.DistantaKm.toFixed(1)} km
                        </div>
                      )}
                    </div>

                    {/* Dietary Preferences */}
                    {produs.Preferinte && produs.Preferinte.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {produs.Preferinte.slice(0, 2).map((pref, idx) => (
                          <span key={idx} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                            <Leaf size={10} />
                            {pref}
                          </span>
                        ))}
                        {produs.Preferinte.length > 2 && (
                          <span className="text-emerald-600 text-xs">+{produs.Preferinte.length - 2}</span>
                        )}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-emerald-700">
                          {pretFinal.toFixed(2)} RON
                        </span>
                        {produs.OFERTA?.[0] && (
                          <span className="text-sm text-gray-400 line-through">
                            {produs.Pret_Initial.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {produs.OFERTA?.[0] && (
                        <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md inline-block">
                          Economii: {produs.OFERTA[0].Reducere.toFixed(2)} RON
                        </p>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 px-2 py-1 rounded-md">
                        <Package size={12} className="text-emerald-600" />
                        <span className="text-emerald-700">
                          {produs.CantitateDisponibila} disponibile
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Section */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => adaugaInCos(produs)}
                        disabled={cantitateInCos >= produs.CantitateDisponibila}
                        className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 py-2 px-3 text-sm font-semibold flex-1"
                      >
                        <Plus size={14} />
                        Adaugă
                      </button>
                      
                      {cantitateInCos > 0 && (
                        <div className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                          <ShoppingCart size={12} />
                          {cantitateInCos}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Modal */}
        {produsSelectat && (
          <ProductModal
            produs={produsSelectat}
            onClose={() => setProdusSelectat(null)}
          />
        )}
      </div>

      {/* Updated Statistics Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Ofertele de Astăzi</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Statistici în timp real despre reducerile disponibile acum
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {totalProduse}
              </div>
              <div className="text-emerald-100 font-semibold mb-1">Produse cu Oferte</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Package size={12} />
                Disponibile acum
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {procentajMediuReducere}%
              </div>
              <div className="text-emerald-100 font-semibold mb-1">Reducere Medie</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Star size={12} />
                Economii garantate
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {totalReduceri.toFixed(0)}
              </div>
              <div className="text-emerald-100 font-semibold mb-1">RON Economii Totale</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Heart size={12} />
                Bani salvați astăzi
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-emerald-100 font-semibold items-center gap-2">
              <Leaf size={16} />
              Împreună luptăm împotriva risipei alimentare!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
