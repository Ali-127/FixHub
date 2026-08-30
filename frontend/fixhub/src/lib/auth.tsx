"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthContext.Provider");
  return ctx;
}

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  async function checkAuth() {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include"
      })
      if(res.ok) {
        const data = await res.json();
        setUser(data.data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    checkAuth();
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch: checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}