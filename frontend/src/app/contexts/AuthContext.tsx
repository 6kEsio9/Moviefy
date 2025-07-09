"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../services/AuthService";
import * as AuthService from "../services/AuthService";

export type AuthContextType = {
  user: User | undefined;
  setUser: (value: User | undefined) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    setUser(AuthService.getUser(0));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
