import { Dialog } from "@headlessui/react"
import { MapPin, Clock, Package, X } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map"), { ssr: false });

type ProdusComanda = {
  Denumire: string;
  Cantitate: number;
  Pret: number;
};

export type ComandaDetalii = {
  id: number;
  restaurant: string;
  locatie?: string;
  produse: ProdusComanda[];
  status: string;
  dataInceput: string;
  dataSfarsit: string | null; // 👈 permite null
  latitude?: number | null;   // 🧭 adăugat
  longitude?: number | null;  // 🧭 adăugat
  
};



type Props = {
  comanda: ComandaDetalii
  onClose: () => void
}

export default function ComandaDetaliiModal({ comanda, onClose }: Props) {
  const [intervalRidicare, setIntervalRidicare] = useState("")

  useEffect(() => {
  const inceput = new Date(comanda.dataInceput);
  const sfarsit = comanda.dataSfarsit ? new Date(comanda.dataSfarsit) : null;

  const optiune1 = inceput.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const optiune2 = sfarsit
    ? sfarsit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'necunoscut';

  setIntervalRidicare(`${optiune1} – ${optiune2}`);
}, [comanda]);


  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-green-700">
              Detalii Comandă
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500">
              <X size={20} />
            </button>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <MapPin size={16} />
              {comanda.restaurant}
            </div>
            {comanda.locatie && (
              <p className="text-sm text-gray-500 ml-6">{comanda.locatie}</p>
            )}
            <div className="flex items-center gap-2 text-blue-700 mt-2">
              <Clock size={16} />
              Ridicare între: <span className="font-semibold">{intervalRidicare}</span>
            </div>
          </div>

          <hr className="my-4 border-green-100" />

          <div className="mb-4">
            <h3 className="text-green-700 font-semibold mb-2">Produse comandate</h3>
            <ul className="space-y-2">
              {comanda.produse.map((prod, i) => (
                <li key={i} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {prod.Denumire} × {prod.Cantitate}
                  </span>
                  <span>{(prod.Pret * prod.Cantitate).toFixed(2)} RON</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <Package className="inline mr-1 text-emerald-500" size={14} />
            Status comandă: <span className="font-semibold text-gray-800">{comanda.status}</span>
          </div>
          {comanda.latitude && comanda.longitude && (
  <div className="mt-4 space-y-3">
    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
        <MapPin size={14} className="text-blue-600" />
        Locația restaurantului
      </h4>
      <p className="text-blue-700 text-sm leading-tight">{comanda.locatie}</p>
    </div>

    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200" style={{ height: '200px' }}>
      <MapComponent lat={comanda.latitude} lng={comanda.longitude} />
    </div>

    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${comanda.latitude},${comanda.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
    >
      Trimite indicații în Google Maps
    </a>
  </div>
)}

        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
