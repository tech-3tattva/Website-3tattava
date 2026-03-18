"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string) => {
    // Placeholder: in real app would call API
    setUser({ id: "1", email, name: email.split("@")[0] });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const register = useCallback(async (email: string, _p: string, name?: string) => {
    // Placeholder: in real app would call API
    setUser({ id: "1", email, name: name || email.split("@")[0] });
  }, []);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
