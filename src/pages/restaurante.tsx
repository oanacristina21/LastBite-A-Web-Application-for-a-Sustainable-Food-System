import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MapPin, Phone, Star, Utensils, ArrowRight, Leaf, Target, Heart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


type Restaurant = {
  IdRestaurant: number;
  Denumire: string;
  Adresa: string;
  Telefon: string;
  NrOferteActive: number;
  Rating: string | null;
};



export default function Restaurante() {
  const [restaurante, setRestaurante] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();



  useEffect(() => {
    fetch("/api/restaurante-publice")
      .then(res => res.json())
      .then(data => {
        console.log("Date restaurante API:", data);
        setRestaurante(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-emerald-200/50 rounded-2xl w-1/2 mx-auto"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-64 bg-emerald-200/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Utensils size={36} className="text-emerald-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Restaurante Partenere
                </h1>
                <p className="text-emerald-100 text-lg font-medium">Descoperă partenerii noștri sustenabili</p>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Leaf size={20} className="text-emerald-100" />
            <span className="text-emerald-100 font-semibold">LastBite - Pentru un viitor sustenabil</span>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {restaurante.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg max-w-md mx-auto">
              <div className="p-6 bg-emerald-100 rounded-2xl mb-6 inline-block">
                <Utensils size={64} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">În curând...</h3>
              <p className="text-emerald-600 text-lg">
                Lucrăm pentru a aduce mai multe restaurante partenere în comunitatea noastră sustenabilă!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                {restaurante.length} Parteneri Sustenabili
              </h2>
              <p className="text-emerald-600 max-w-2xl mx-auto">
                Alătură-te misiunii noastre de a reduce risipa alimentară și de a sprijini afacerile locale
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {restaurante.map((restaurant) => {
                console.log('Restaurant:', restaurant.Denumire, 'Rating:', restaurant.Rating);
                return (
                  <Card key={restaurant.IdRestaurant} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {restaurant.Denumire}
                          </h3>
                          <div className="flex items-start gap-2 text-emerald-600 mb-2">
                            <MapPin size={14} className="text-emerald-500 flex-shrink-0 mt-1" />
                            <span className="text-sm leading-relaxed font-medium line-clamp-2">{restaurant.Adresa}</span>
                          </div>
                        </div>
                        {restaurant.Rating && (
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                            <Star size={12} className="text-amber-500 fill-current" />
                            <span className="text-xs font-bold text-amber-700">
                              {restaurant.Rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {/* Contact Info */}
                      <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-lg">
                        <div className="p-1 bg-emerald-100 rounded-md">
                          <Phone size={12} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 truncate">{restaurant.Telefon}</span>
                      </div>

                      {/* Offers Badge */}
                      <div className="flex items-center justify-center">
                        <Badge 
                          variant={restaurant.NrOferteActive > 0 ? "default" : "secondary"}
                          className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                            restaurant.NrOferteActive > 0 
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md" 
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Target size={12} />
                          {restaurant.NrOferteActive > 0 
                            ? `${restaurant.NrOferteActive} Oferte Active` 
                            : "Fără oferte"
                          }
                        </Badge>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => router.push(`/produse-publice?restaurantId=${restaurant.IdRestaurant}`)}
                        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 group flex items-center justify-center gap-1 ${
                          restaurant.NrOferteActive > 0
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={restaurant.NrOferteActive === 0}
                      >
                        <Heart size={14} />
                        <span>
                          {restaurant.NrOferteActive > 0 ? "Salvează Mâncarea!" : "Momentan Indisponibil"}
                        </span>
                        {restaurant.NrOferteActive > 0 && (
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Impactul Nostru Sustenabil</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Statistici în timp real despre misiunea noastră de a reduce risipa alimentară
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {restaurante.length}
              </div>
              <div className="text-emerald-100 font-semibold mb-1">Restaurante Partenere</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Utensils size={12} />
                În creștere constantă
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                {restaurante.reduce((sum, r) => sum + r.NrOferteActive, 0)}
              </div>
              <div className="text-emerald-100 font-semibold mb-1">Oferte Active</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Target size={12} />
                Mâncare salvată zilnic
              </div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-2xl font-bold mb-2">
                <Leaf size={24} className="text-emerald-100 mx-auto" />
              </div>
              <div className="text-emerald-100 font-semibold mb-1">Sustenabilitate</div>
              <div className="text-emerald-200 text-sm flex items-center justify-center gap-1">
                <Heart size={12} />
                Viitor mai verde pentru toți
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-emerald-100 font-semibold items-center gap-2">
              <Leaf size={16} />
              Împreună facem diferența pentru planeta noastră!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}