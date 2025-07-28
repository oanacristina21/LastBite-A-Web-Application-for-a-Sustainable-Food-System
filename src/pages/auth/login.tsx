import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, RefreshCw, ShoppingCart, Target, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext'; // Importăm contextul
// în @/components/ui/input.tsx
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={`border rounded px-3 py-2 ${className}`} {...props} />
  )
);
Input.displayName = 'Input';


export default function Login() {
  const router = useRouter();
  const { setRole } = useUser(); 

  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, parola }),
    });
    
    if (!res.ok) {
      alert('Eroare la autentificare.');
      return;
    }

    const meRes = await fetch('/api/auth/me');
    const user = await meRes.json();
    localStorage.setItem('role', user.tip);
    setRole(user.tip);

    if (user.tip === 'admin') {

    router.push('/admin').then(() => window.location.reload());
  } else if (user.tip === 'client') {
    router.push('/dashboard').then(() => window.location.reload());
  } else if (user.tip === 'restaurant') {
    router.push('/restaurant-dashboard').then(() => window.location.reload());
  } else {
    alert('Tip necunoscut. Contactează administratorul.');
  }
  };

const handlePasswordReset = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch('/api/auth/reset-password-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: resetEmail }),
  });

  if (res.ok) {
    alert(`Link de resetare parola trimis la ${resetEmail}!`);
  } else {
    alert('Eroare la trimiterea linkului de resetare.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header Section - Made smaller */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield size={40} className="text-emerald-100" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Bine ai venit înapoi!
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Conectează-te pentru a continua să salvezi mâncarea și să protejezi planeta! 
          </p>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center px-6 py-12 -mt-6 relative z-10">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-emerald-800 mb-2">
              {isResetMode ? 'Resetează Parola' : 'Autentificare'}
            </CardTitle>
            <p className="text-emerald-600">
              {isResetMode 
                ? 'Introdu adresa de email pentru a primi linkul de resetare'
                : 'Intră în contul tău pentru a continua'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isResetMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
                  >
                    Ai uitat parola?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 text-lg font-semibold"
                >
                  <ArrowRight size={20} className="mr-2" />
                  Intră în cont
                </Button>

              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                {/* Reset Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-emerald-700">
                    Adresa de email
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                    <Input
                      type="email"
                      placeholder="nume@exemplu.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500 h-12 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 text-lg font-semibold"
                >
                  <RefreshCw size={20} className="mr-2" />
                  Trimite linkul de resetare
                </Button>

                {/* Back to Login */}
                <Button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12"
                >
                  Înapoi la autentificare
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-6">De ce să te conectezi?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <ShoppingCart size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Comenzi Rapide</p>
              <p className="text-emerald-100 text-sm">Salvează produsele tale preferate</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <Target size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Oferte Personalizate</p>
              <p className="text-emerald-100 text-sm">Primește reduceri pentru tine</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex justify-center mb-3">
                <Leaf size={32} className="text-emerald-100" />
              </div>
              <p className="font-semibold">Impact Măsurat</p>
              <p className="text-emerald-100 text-sm">Vezi câtă mâncare ai salvat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}