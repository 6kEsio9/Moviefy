"use client";

import { createContext, ReactNode, useCallback, useEffect } from "react";
import { UserTemp } from "../services/AuthService";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type AuthContextType = {
  user: UserTemp | null;
  onLogin: (value: UserTemp) => void;
  onLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<UserTemp | null>("user", null);

  const onLogin = useCallback(
    (user: UserTemp) => {
      setUser(user);
    },
    [setUser]
  );

  const onLogout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
