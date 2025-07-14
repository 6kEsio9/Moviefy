"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../services/AuthService";
import { jwtDecode } from "jwt-decode";

import * as AuthService from "../services/AuthService";

export type AuthContextType = {
  user: User | null;
  onLogin: (value: string, user: User) => void;
  onLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    const decoded = jwtDecode(token!);
    console.log(decoded);
    const userId = decoded.sub;
    const fetched = async () => {
      const res = await AuthService.getUser(userId!);
    };
    fetched();
  }, []);

  const onLogin = useCallback(
    (token: string, user: User) => {
      setToken(token);
      setUser(user);
    },
    [setToken]
  );

  const onLogout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
