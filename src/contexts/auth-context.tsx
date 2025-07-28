// src/contexts/auth-context.tsx
"use client"; // Important pentru Next.js App Router dacă folosești hooks ca useState/useContext

import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, parola: password }), // trebuie să trimiți "parola", nu "password"
    });

    if (!res.ok) {
      throw new Error('Autentificare eșuată');
    }

    const data = await res.json();

    setUser({
      id: data.id.toString(),
      name: 'Utilizator',
      email,
    });
  } catch (err) {
    console.error('Eroare autentificare:', err);
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    // Aici poți adăuga logica de invalidare a sesiunii pe backend, dacă este cazul
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}