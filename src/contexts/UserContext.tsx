// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext<{ role: string | null; setRole: (role: string) => void }>({
  role: null,
  setRole: () => {}
});

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};
