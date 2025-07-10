"use client";

import { createContext, ReactNode, useCallback, useEffect } from "react";
import { User } from "../services/AuthService";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type AuthContextType = {
  user: User | null;
  onLogin: (value: User) => void;
  onLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("user", null);

  const onLogin = useCallback(
    (user: User) => {
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
