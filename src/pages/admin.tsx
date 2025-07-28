import { useEffect, useState } from "react";
import { Trash2, Users, Utensils, Package, Percent, Heart, MapPin, Star, Settings, Grid3X3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Statistici = {
  utilizatori: number;
  restaurante: number;
  produse: number;
  oferte: number;
  economii: number;
};

type Recenzie = {
  IdRecenzie: number;
  MesajClient: string | null;
  Rating: number;
  RaspunsRestaurant: string | null;
  DataRecenzie: string;
  COMANDA: {
    CLIENT: {
      Nume: string;
      Prenume: string;
    };
    RESTAURANT: {
      Denumire: string;
    };
  };
};

type Utilizator = {
  id: number;
  email: string;
  tip: string;
  telefon: string | null;
};

type Categorie = {
  IdCategorie: number;
  Denumire: string;
};

type Localitate = {
  IdLocalitate: number;
  Denumire: string;
  IdJudet: number;
  JUDET?: {
    Denumire: string;
  };
};

type Preferinta = {
  IdPreferintaDietetica: number;
  Denumire: string;
};

type Judet = {
  IdJudet: number;
  Denumire: string;
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [utilizatori, setUtilizatori] = useState<Utilizator[]>([]);
  const [search, setSearch] = useState("");
  const [categorii, setCategorii] = useState<Categorie[]>([]);
  const [categorieNoua, setCategorieNoua] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValoare, setEditValoare] = useState("");
  const [preferinte, setPreferinte] = useState<Preferinta[] | null>(null);
  const [preferintaNoua, setPreferintaNoua] = useState("");
  const [editPreferintaId, setEditPreferintaId] = useState<number | null>(null);
  const [editDenumire, setEditDenumire] = useState("");
  const [stats, setStats] = useState<Statistici | null>(null);
  const [judete, setJudete] = useState<Judet[]>([]);
  const [numeJudet, setNumeJudet] = useState("");
  const [editJudetId, setEditJudetId] = useState<number | null>(null);
  const [editJudetNume, setEditJudetNume] = useState("");
  const [localitati, setLocalitati] = useState<Localitate[]>([]);
  const [numeLocalitate, setNumeLocalitate] = useState("");
  const [judetSelectat, setJudetSelectat] = useState<number | null>(null);
  const [editLocalitateId, setEditLocalitateId] = useState<number | null>(null);
  const [editLocalitateNume, setEditLocalitateNume] = useState("");
  const [editLocalitateJudet, setEditLocalitateJudet] = useState<number | null>(null);
  const [recenzii, setRecenzii] = useState<Recenzie[]>([]);
  const [raspunsNou, setRaspunsNou] = useState<{ [id: number]: string }>({});

  // All your existing functions remain the same
  const incarcaRecenzii = async () => {
    const res = await fetch("/api/admin/recenzii");
    const data = await res.json();
    setRecenzii(data);
  };

  const stergeRecenzie = async (id: number) => {
    if (!confirm("Ești sigur că vrei să ștergi această recenzie?")) return;
    await fetch(`/api/admin/recenzii?id=${id}`, {
      method: "DELETE",
    });
    await incarcaRecenzii();
  };

  const incarcaLocalitati = async () => {
    const res = await fetch("/api/admin/localitati");
    const data = await res.json();
    setLocalitati(data);
  };

  const adaugaLocalitate = async () => {
    if (!numeLocalitate.trim() || !judetSelectat) return;
    await fetch("/api/admin/localitati", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denumire: numeLocalitate, idJudet: judetSelectat }),
    });
    setNumeLocalitate("");
    setJudetSelectat(null);
    incarcaLocalitati();
  };

  const stergeLocalitate = async (id: number) => {
    if (!confirm("Ștergi această localitate?")) return;
    const res = await fetch(`/api/admin/localitati?id=${id}`, { method: "DELETE" });
    if (!res.ok) alert("Nu poți șterge – sunt restaurante/utilizatori legați.");
    incarcaLocalitati();
  };

  const salveazaEditareLocalitate = async () => {
    if (!editLocalitateId || !editLocalitateNume.trim() || !editLocalitateJudet) return;

    await fetch("/api/admin/localitati", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editLocalitateId,
        denumire: editLocalitateNume,
        idJudet: editLocalitateJudet,
      }),
    });

    setEditLocalitateId(null);
    setEditLocalitateNume("");
    setEditLocalitateJudet(null);
    incarcaLocalitati();
  };

  const incarcaJudete = async () => {
    const res = await fetch("/api/admin/judete");
    const data = await res.json();
    setJudete(data);
  };

  const adaugaJudet = async () => {
    if (!numeJudet.trim()) return;
    await fetch("/api/admin/judete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denumire: numeJudet }),
    });
    setNumeJudet("");
    incarcaJudete();
  };

  const stergeJudet = async (id: number) => {
    if (!confirm("Ești sigur că vrei să ștergi județul?")) return;
    const res = await fetch(`/api/admin/judete?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) incarcaJudete();
    else alert("Nu se poate șterge județul — are localități legate.");
  };

  const salveazaEditareJudet = async () => {
    if (!editJudetNume.trim() || editJudetId === null) return;

    await fetch("/api/admin/judete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editJudetId, denumire: editJudetNume }),
    });
    setEditJudetId(null);
    setEditJudetNume("");
    incarcaJudete();
  };

  const salveazaPreferinta = async () => {
    if (!editDenumire.trim() || editPreferintaId === null) return;

    await fetch("/api/preferinte", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editPreferintaId, denumire: editDenumire }),
    });

    setEditPreferintaId(null);
    setEditDenumire("");
    await loadPreferinte();
  };

  const loadPreferinte = async () => {
    const res = await fetch("/api/preferinte");
    const data = await res.json();
    setPreferinte(data);
  };

  const adaugaPreferinta = async () => {
    if (!preferintaNoua.trim()) return;
    await fetch("/api/preferinte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denumire: preferintaNoua }),
    });
    setPreferintaNoua("");
    await loadPreferinte();
  };

  const stergePreferinta = async (id: number) => {
    if (!confirm("Ești sigur?")) return;
    await fetch(`/api/preferinte?id=${id}`, { method: "DELETE" });
    await loadPreferinte();
  };

  const loadCategorii = async () => {
    const res = await fetch('/api/categorii');
    const data = await res.json();
    setCategorii(data);
  };

  const adaugaCategorie = async () => {
    if (!categorieNoua.trim()) return;
    await fetch('/api/categorii', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ denumire: categorieNoua })
    });
    setCategorieNoua("");
    loadCategorii();
  };

  const stergeCategorie = async (id: number) => {
    if (!confirm("Ștergi această categorie?")) return;
    await fetch(`/api/categorii?id=${id}`, { method: "DELETE" });
    loadCategorii();
  };

  const salveazaEditare = async () => {
    if (!editValoare.trim() || editId === null) return;
    await fetch('/api/categorii', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, denumire: editValoare })
    });
    setEditId(null);
    setEditValoare("");
    loadCategorii();
  };

  const loadUtilizatori = async () => {
    const res = await fetch('/api/admin/utilizatori');
    const data = await res.json();
    setUtilizatori(data);
  };

  const stergeUtilizator = async (id: number) => {
    if (!confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;
    await fetch(`/api/admin/utilizatori?id=${id}`, { method: "DELETE" });
    await loadUtilizatori();
  };

  useEffect(() => {
  const incarcaStatistici = async () => {
    try {
      const res = await fetch("/api/admin/statistici");
      if (!res.ok) throw new Error("Eroare server");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Eroare la încărcarea statisticilor:", error);
    }
  };

  loadUtilizatori();
  loadCategorii();
  loadPreferinte();
  incarcaJudete();
  incarcaLocalitati();
  incarcaRecenzii();
  incarcaStatistici();

}, []);


  const filtrati = utilizatori.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Grid3X3 },
    { id: "utilizatori", label: "Utilizatori", icon: Users },
    { id: "recenzii", label: "Recenzii", icon: Star },
    { id: "categorii", label: "Categorii", icon: Package },
    { id: "judete", label: "Județe", icon: MapPin },
    { id: "localitati", label: "Localități", icon: MapPin },
    { id: "preferinte", label: "Preferințe", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">LB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LastBite Admin</h1>
                <p className="text-sm text-gray-600">Panou de administrare</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeSection === item.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Statistici Generale</h2>
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Utilizatori</CardTitle>
                      <Users className="h-5 w-5 opacity-80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.utilizatori}</div>
                      <p className="text-xs opacity-80">Total înregistrați</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-lime-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Restaurante</CardTitle>
                      <Utensils className="h-5 w-5 opacity-80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.restaurante}</div>
                      <p className="text-xs opacity-80">Partenere active</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Categorii</CardTitle>
                      <Package className="h-5 w-5 opacity-80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.produse}</div>
                      <p className="text-xs opacity-80">Categorii produse</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Oferte</CardTitle>
                      <Percent className="h-5 w-5 opacity-80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.oferte}</div>
                      <p className="text-xs opacity-80">Oferte active</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Economii</CardTitle>
                      <Heart className="h-5 w-5 opacity-80" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.economii.toFixed(0)} RON</div>
                      <p className="text-xs opacity-80">Total economii</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeSection === "utilizatori" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Gestionare Utilizatori</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Caută după email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tip</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefon</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrati.map(user => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.tip === 'admin' ? 'bg-red-100 text-red-800' : 
                              user.tip === 'restaurant' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.tip}
                            </span>
                          </td>
                          <td className="py-3 px-4">{user.telefon ?? "—"}</td>
                          <td className="py-3 px-4 text-center">
                            {user.tip !== "admin" && (
                              <button
                                onClick={() => stergeUtilizator(user.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Șterge"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "recenzii" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Gestionare Recenzii</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Restaurant</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Mesaj</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Răspuns</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recenzii.map((r) => (
                        <tr key={r.IdRecenzie} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{r.COMANDA.CLIENT.Nume} {r.COMANDA.CLIENT.Prenume}</td>
                          <td className="py-3 px-4">{r.COMANDA.RESTAURANT.Denumire}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < r.Rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{r.Rating}/5</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="truncate">{r.MesajClient || "—"}</p>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            {r.RaspunsRestaurant ? (
                              <p className="text-sm text-gray-800 truncate">{r.RaspunsRestaurant}</p>
                            ) : (
                              <textarea
                                className="border border-gray-300 w-full px-2 py-1 rounded text-sm resize-none"
                                rows={2}
                                value={raspunsNou[r.IdRecenzie] ?? ""}
                                onChange={(e) =>
                                  setRaspunsNou((prev) => ({ ...prev, [r.IdRecenzie]: e.target.value }))
                                }
                                placeholder="Răspuns restaurant..."
                              />
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            <button
                              onClick={() => stergeRecenzie(r.IdRecenzie)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "categorii" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Gestionare Categorii</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Categorie nouă..."
                    value={categorieNoua}
                    onChange={(e) => setCategorieNoua(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={adaugaCategorie}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Adaugă
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Denumire</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorii.map(c => (
                        <tr key={c.IdCategorie} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{c.IdCategorie}</td>
                          <td className="py-3 px-4">
                            {editId === c.IdCategorie ? (
                              <input
                                value={editValoare}
                                onChange={(e) => setEditValoare(e.target.value)}
                                className="border border-gray-300 px-3 py-1 rounded w-full focus:ring-2 focus:ring-green-500"
                              />
                            ) : (
                              c.Denumire
                            )}
                          </td>
                          <td className="py-3 px-4 text-center space-x-2">
                            {editId === c.IdCategorie ? (
                              <button
                                onClick={salveazaEditare}
                                className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                              >
                                Salvează
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditId(c.IdCategorie);
                                  setEditValoare(c.Denumire);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                Editează
                              </button>
                            )}
                            <button
                              onClick={() => stergeCategorie(c.IdCategorie)}
                              className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Șterge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "judete" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Gestionare Județe</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Nume județ"
                    value={numeJudet}
                    onChange={(e) => setNumeJudet(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={adaugaJudet}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Adaugă
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Denumire</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {judete.map((j) => (
                        <tr key={j.IdJudet} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{j.IdJudet}</td>
                          <td className="py-3 px-4">
                            {editJudetId === j.IdJudet ? (
                              <input
                                value={editJudetNume}
                                onChange={(e) => setEditJudetNume(e.target.value)}
                                className="border border-gray-300 px-3 py-1 rounded w-full focus:ring-2 focus:ring-green-500"
                              />
                            ) : (
                              j.Denumire
                            )}
                          </td>
                          <td className="py-3 px-4 text-center space-x-2">
                            {editJudetId === j.IdJudet ? (
                              <button
                                onClick={salveazaEditareJudet}
                                className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                              >
                                Salvează
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditJudetId(j.IdJudet);
                                  setEditJudetNume(j.Denumire);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                Editează
                              </button>
                            )}
                            <button
                              onClick={() => stergeJudet(j.IdJudet)}
                              className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Șterge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "localitati" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Gestionare Localități</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Nume localitate"
                    value={numeLocalitate}
                    onChange={(e) => setNumeLocalitate(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <select
                    value={judetSelectat ?? ""}
                    onChange={(e) => setJudetSelectat(Number(e.target.value))}
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-0 sm:min-w-48"
                  >
                    <option value="">Alege județ</option>
                    {judete.map((j) => (
                      <option key={j.IdJudet} value={j.IdJudet}>
                        {j.Denumire}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={adaugaLocalitate}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Adaugă
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Denumire</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Județ</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localitati.map((l) => (
                        <tr key={l.IdLocalitate} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{l.IdLocalitate}</td>
                          <td className="py-3 px-4">
                            {editLocalitateId === l.IdLocalitate ? (
                              <input
                                value={editLocalitateNume}
                                onChange={(e) => setEditLocalitateNume(e.target.value)}
                                className="border border-gray-300 px-3 py-1 rounded w-full focus:ring-2 focus:ring-green-500"
                              />
                            ) : (
                              l.Denumire
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {editLocalitateId === l.IdLocalitate ? (
                              <select
                                value={editLocalitateJudet ?? ""}
                                onChange={(e) => setEditLocalitateJudet(Number(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-green-500"
                              >
                                <option value="">Alege județ</option>
                                {judete.map((j) => (
                                  <option key={j.IdJudet} value={j.IdJudet}>
                                    {j.Denumire}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              l.JUDET?.Denumire ?? "—"
                            )}
                          </td>
                          <td className="text-center py-3 px-4 space-x-2">
                            {editLocalitateId === l.IdLocalitate ? (
                              <>
                                <button
                                  onClick={salveazaEditareLocalitate}
                                  className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                                >
                                  Salvează
                                </button>
                                <button
                                  onClick={() => {
                                    setEditLocalitateId(null);
                                    setEditLocalitateNume("");
                                    setEditLocalitateJudet(null);
                                  }}
                                  className="text-gray-500 hover:text-gray-700 font-medium px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                                >
                                  Anulează
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditLocalitateId(l.IdLocalitate);
                                    setEditLocalitateNume(l.Denumire);
                                    setEditLocalitateJudet(l.IdJudet);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                >
                                  Editează
                                </button>
                                <button
                                  onClick={() => stergeLocalitate(l.IdLocalitate)}
                                  className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                  Șterge
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "preferinte" && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Preferințe Dietetice</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3 mb-6">
                  <input
                    value={preferintaNoua}
                    onChange={(e) => setPreferintaNoua(e.target.value)}
                    placeholder="Ex: Vegan"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={adaugaPreferinta}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Adaugă
                  </button>
                </div>
                {preferinte === null ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-green-600 mt-2">Se încarcă preferințele...</p>
                  </div>
                ) : preferinte.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">Nu există preferințe dietetice.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Denumire</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preferinte.map((p) => (
                          <tr key={p.IdPreferintaDietetica} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              {editPreferintaId === p.IdPreferintaDietetica ? (
                                <input
                                  value={editDenumire}
                                  onChange={(e) => setEditDenumire(e.target.value)}
                                  className="border border-gray-300 px-3 py-1 rounded w-full focus:ring-2 focus:ring-green-500"
                                />
                              ) : (
                                p.Denumire
                              )}
                            </td>
                            <td className="text-center py-3 px-4 space-x-2">
                              {editPreferintaId === p.IdPreferintaDietetica ? (
                                <>
                                  <button
                                    onClick={salveazaPreferinta}
                                    className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                                  >
                                    Salvează
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditPreferintaId(null);
                                      setEditDenumire("");
                                    }}
                                    className="text-gray-500 hover:text-gray-700 font-medium px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                                  >
                                    Anulează
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditPreferintaId(p.IdPreferintaDietetica);
                                      setEditDenumire(p.Denumire);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                  >
                                    Editează
                                  </button>
                                  <button
                                    onClick={() => stergePreferinta(p.IdPreferintaDietetica)}
                                    className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    Șterge
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}