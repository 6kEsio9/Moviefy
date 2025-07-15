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
import dayjs from "dayjs";

import * as AuthService from "../services/AuthService";

export type AuthContextType = {
  user: User | null;
  onLogin: (value: string, user: User, refreshToken: string) => void;
  onLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage("token", null);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      const decoded: any = jwtDecode(token);
      const isExpired = dayjs.unix(decoded.exp).isBefore(dayjs());

      let validToken = token;

      if (isExpired && refreshToken) {
        try {
          const res = await AuthService.refreshToken(refreshToken);
          validToken = res.data.accessToken;
          setToken(validToken);
          if (res.data.refreshToken) setRefreshToken(res.data.refreshToken);
        } catch (err) {
          console.error("Failed to refresh token", err);
          setToken(null);
          setRefreshToken(null);
          setUser(null);
          return;
        }
      }

      const userId = jwtDecode(validToken).sub;

      try {
        const res = await AuthService.getUser(userId!);
        setUser({
          id: res.data.id,
          username: res.data.username,
          pfp: res.data.pfp,
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      }
    };

    init();
  }, [token]);

  const onLogin = useCallback(
    (token: string, user: User, refreshToken: string) => {
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
