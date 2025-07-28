import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setNewPassword('');
    } else {
      setError(data.mesaj || 'Eroare la resetarea parolei');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center">Resetează Parola</h2>

        {success ? (
          <p className="text-green-500 text-center">Parola a fost resetată cu succes!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-700">Noua Parola</label>
              <input
                type="password"
                className="w-full p-3 border border-emerald-300 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Se procesează...' : 'Resetează Parola'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
