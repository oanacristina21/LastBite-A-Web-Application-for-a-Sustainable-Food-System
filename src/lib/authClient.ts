// src/lib/authClient.ts
export async function getUser() {
  const res = await fetch('/api/auth/me'); // 🟢 corect dacă me.ts este în /api/auth
  if (!res.ok) return null;
  return await res.json();
}
