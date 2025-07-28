import { X, MapPin, Clock, Package } from "lucide-react";
import MapComponent from "./Map";
import { formatOraRomaniei } from "@/utils/date";



type ProductModalProps = {
  produs: {
    Denumire: string;
    Imagine?: string;
    Descriere?: string;
    Pret_Initial: number;
    OFERTA: { Reducere: number; DataSfarsit: string }[];
    Preferinte?: string[];
    RESTAURANT: {
      Denumire: string;
      Latitude?: number | null;
      Longitude?: number | null;
      Adresa?: string;
Judet?: string;
Localitate?: string;


    };
    DistantaKm?: number;
    CantitateDisponibila: number;
  };
  onClose: () => void;
};

export default function ProductModal({ produs, onClose }: ProductModalProps) {
  const pretFinal = produs.Pret_Initial - (produs.OFERTA?.[0]?.Reducere || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-3xl w-full max-h-[90vh] relative shadow-2xl border border-green-100 animate-scale-in overflow-hidden">
        {/* Header with close button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-lg"
          >
            <X size={20} />
          </button>
          
          {/* Product Image */}
          {produs.Imagine && (
            <div className="relative overflow-hidden">
              <img
                src={produs.Imagine}
                alt={produs.Denumire}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product Info */}
            <div className="space-y-4">
              {/* Product Title and Restaurant */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                  {produs.Denumire}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-green-600" />
                  <span className="font-medium">{produs.RESTAURANT.Denumire}</span>
                </div>
              </div>

              {/* Description */}
              {produs.Descriere && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed italic">{produs.Descriere}</p>
                </div>
              )}

              {/* Distance */}
              {typeof produs.DistantaKm === "number" && (
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="text-blue-700 font-medium text-sm">
                    La aprox. {produs.DistantaKm.toFixed(2)} km distanță
                  </span>
                </div>
              )}

              {/* Preferences Tags */}
              {Array.isArray(produs.Preferinte) && produs.Preferinte.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Caracteristici:</h4>
                  <div className="flex flex-wrap gap-2">
                    {produs.Preferinte.map((pref, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200 rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Location Info and Map */}
              {produs.RESTAURANT.Latitude && produs.RESTAURANT.Longitude && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
    <MapPin size={14} className="text-blue-600" />
    Locația restaurantului
  </h4>
  <p className="text-blue-700 text-sm leading-tight">
    {produs.RESTAURANT.Adresa}, {produs.RESTAURANT.Localitate}, {produs.RESTAURANT.Judet}
  </p>
</div>

                  
                  {/* Map Component */}
                  <div className="rounded-xl overflow-hidden shadow-md border border-gray-200" style={{ height: '200px' }}>
                    <MapComponent
                      lat={produs.RESTAURANT.Latitude}
                      lng={produs.RESTAURANT.Longitude}
                    />
                  </div>
                </div>
              )}
            </div>
            

            {/* Right Column - Price and Info */}
            <div className="space-y-4">
              {/* Price Section */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200 shadow-lg">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-bold text-green-700">
                    {pretFinal.toFixed(2)} RON
                  </span>
                  {produs.OFERTA?.[0] && (
                    <span className="line-through text-gray-500 text-lg">
                      {produs.Pret_Initial.toFixed(2)} RON
                    </span>
                  )}
                </div>
                
                {produs.OFERTA?.[0] && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 text-red-600 font-semibold mb-1">
                      <Clock size={16} />
                      <span className="text-sm">Ofertă specială!</span>
                    </div>
                    <p className="text-red-700 text-sm mb-1">
                      Economisești {produs.OFERTA[0].Reducere.toFixed(2)} RON
                    </p>
                    <p className="text-red-600 text-xs">
  Valabilă până la: {formatOraRomaniei(produs.OFERTA[0].DataSfarsit)}
</p>

                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <Package size={16} className="text-gray-600" />
                <span className="text-gray-700 font-medium text-sm">
                  Disponibil: <span className="text-green-600 font-bold">{produs.CantitateDisponibila} buc.</span>
                </span>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}