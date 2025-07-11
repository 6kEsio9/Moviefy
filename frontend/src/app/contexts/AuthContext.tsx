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
    // const decoded = jwtDecode(token!);
    // console.log(decoded);
    setUser({
      id: "0",
      username: "Georgi",
      pfp: "/images/pfp.jpeg",
    });
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
  }, [setToken]);

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
