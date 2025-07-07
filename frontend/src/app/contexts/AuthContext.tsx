"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../services/AuthService";
import * as AuthService from "../services/AuthService";

export type AuthContextType = {
  user: User | undefined;
  setUser: (value: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: {
    id: -1,
    username: "",
    bio: "",
    pfp: "",
    watchList: { watched: [], isWatching: [], willWatch: [] },
    reviews: [],
  },
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>({
    id: -1,
    username: "",
    bio: "",
    pfp: "",
    watchList: { watched: [], isWatching: [], willWatch: [] },
    reviews: [],
  });

  useEffect(() => {
    setUser(AuthService.getUser(0));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
