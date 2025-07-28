"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, MapPin, ShoppingBag, User as UserIcon, ShoppingCart, Leaf, Bell } from "lucide-react"
import type { User } from "@/lib/types" // tipul TypeScript


type ItemCos = {
  IdProdus: number
  Denumire: string
  pret: number
  cantitate: number
  idRestaurant: number
  stocMaxim: number
}

const clientNavigation = [
  { name: "Acasă", href: "/", icon: Home },
  { name: "Oferte", href: "/produse-publice", icon: ShoppingBag },
  { name: "Restaurante", href: "/restaurante", icon: MapPin },
]

const restaurantNavigation = [
  { name: "Acasă", href: "/", icon: Home },
  { name: "Restaurant Dashboard", href: "/restaurant-dashboard", icon: UserIcon },
  { name: "Setări Profil", href: "/restaurant-profil", icon: UserIcon },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  const [cosCount, setCosCount] = useState(0)
  const [notifCount, setNotifCount] = useState(0) // Notificări pentru restaurant
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)


  useEffect(() => {
  fetch("/api/auth/me")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
  if (data?.id && data?.tip) {
    setUser({
       id: data.id, // <- păstrează ca number
      tip: data.tip,
      nume: data.nume,
      denumireRestaurant: data.denumireRestaurant,
    })

        // Fetch notificări pentru orice tip user
        fetch("/api/notificari")
          .then(res => res.ok ? res.json() : [])
          .then(notificari => {
            setNotifCount(Array.isArray(notificari) ? notificari.length : 0)
          })
          .catch(() => setNotifCount(0))
          
      } else {
        setUser(null)
      }
    })
    .catch(() => setUser(null))
    .finally(() => setLoading(false))

  const cosLocal = JSON.parse(localStorage.getItem("cos") || "[]")
  const totalProduse = (cosLocal as ItemCos[]).reduce((acc, p) => acc + p.cantitate, 0)
  setCosCount(totalProduse)
}, [])



  const handleLogout = async () => {
  try {
    // 1. Apelează API-ul care șterge cookie-ul
    await fetch("/api/auth/logout");

    // 2. Curăță contextul + localStorage
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("cos");

    // 3. Navighează spre pagina de login
    router.push("/auth/login");

  } catch (error) {
    console.error("Eroare la delogare:", error);
  }
};


  if (loading) return null

  // Alege meniul în funcție de tip user
  const navigation = user?.tip === "restaurant" ? restaurantNavigation : clientNavigation

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                LastBite
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-700 shadow-sm"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {name}
                  </Link>
                )
              })}

              {/* Dacă e client, afisam Dashboard */}
              {user && user.tip === "client" && (
                <Link
                  href="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              )}

              {/* Buton notificări pentru restaurant */}
              {/* Buton notificări pentru ambele tipuri */}
{user && (user.tip === "restaurant" || user.tip === "client") && (
  <Link
  href="/notificari"
  className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${pathname === "/notificari" ? "bg-green-100 text-green-700 shadow-sm" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`}
>
  <Bell className="w-5 h-5 mr-2" />
  Notificări
  {notifCount > 0 && (
    <Badge className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
      {notifCount}
    </Badge>
  )}
</Link>


)}


              {/* Cos pentru client */}
              {user && user.tip === "client" && (
                <Link
                  href="/cos"
                  className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === "/cos"
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Coș
                  {cosCount > 0 && (
                        <Badge className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {cosCount}
                    </Badge>
                  )}
                </Link>
                
              )}
            </div>
          </div>

          {/* Right side - User section */}
          <div className="hidden md:flex items-center space-x-4">

            {user ? (
              <>
                <Badge
  variant="secondary"
  className="bg-green-100 text-green-700 hover:bg-green-200 hidden sm:flex"
>
  <UserIcon className="w-3 h-3 mr-1" />
  {user.tip === 'restaurant'
    ? user.denumireRestaurant
    : user.nume}
</Badge>


                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  onClick={handleLogout}
                >
                  Deconectare
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/register"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 hidden sm:inline"
                >
                  Înregistrare
                </Link>
                <Link href="/auth/login">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    Autentificare
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {/* Mobile - Burger Menu Button */}
<div className="md:hidden flex items-center space-x-2">
  {user && (
    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
      {user.tip === 'restaurant' ? user.denumireRestaurant : user.nume}
    </Badge>
  )}
  <Button
    variant="ghost"
    size="sm"
    onClick={toggleMobileMenu}
    className="text-gray-700 hover:text-green-600 hover:bg-green-50"
  >
    {isMobileMenuOpen ? (
      <span className="text-xl">&times;</span> // X - close icon
    ) : (
      <span className="text-xl">&#9776;</span> // ☰ - hamburger icon
    )}
  </Button>
</div>

        </div>
      </div>

      {isMobileMenuOpen && (
  <>
    <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-green-100 shadow-lg z-50">
      <div className="px-4 py-4 space-y-2">
        {navigation.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={name}
              href={href}
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-green-100 text-green-700 shadow-sm" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {name}
            </Link>
          )
        })}

        {user?.tip === "client" && (
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/dashboard" ? "bg-green-100 text-green-700 shadow-sm" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <UserIcon className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
        )}

        {user && (
          <Link
            href="/notificari"
            onClick={closeMobileMenu}
            className={`relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/notificari" ? "bg-green-100 text-green-700 shadow-sm" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <Bell className="h-5 w-5 mr-3" />
            Notificări
            {notifCount > 0 && (
              <Badge className="ml-auto h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {notifCount}
              </Badge>
            )}
          </Link>
        )}

        {user?.tip === "client" && (
          <Link
            href="/cos"
            onClick={closeMobileMenu}
            className={`relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/cos" ? "bg-green-100 text-green-700 shadow-sm" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <ShoppingCart className="h-5 w-5 mr-3" />
            Coș
            {cosCount > 0 && (
              <Badge className="ml-auto h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {cosCount}
              </Badge>
            )}
          </Link>
        )}

        <div className="border-t border-green-100 my-4" />

        {user ? (
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={() => {
              closeMobileMenu()
              handleLogout()
            }}
          >
            Deconectare
          </Button>
        ) : (
          <div className="space-y-2">
            <Link href="/auth/register" onClick={closeMobileMenu}>
              <Button variant="outline" className="w-full">Înregistrare</Button>
            </Link>
            <Link href="/auth/login" onClick={closeMobileMenu}>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                Autentificare
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>

    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={closeMobileMenu} />
  </>
)}

    </nav>
  )
}
