import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PlataEsuata() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-red-100 rounded-3xl overflow-hidden shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="p-6 bg-red-100 rounded-2xl mb-6 inline-block">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 mb-4">Plata a eșuat</h1>
          <p className="text-red-600 leading-relaxed mb-6">
            Te rugăm să încerci din nou.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Încearcă din nou
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}