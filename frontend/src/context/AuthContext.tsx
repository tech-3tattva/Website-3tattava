"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthResponse, User } from "@shared/types";
import { api, setAccessToken, USE_MOCK } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function refreshSession() {
      try {
        const response = await api.post<AuthResponse>("/auth/refresh", {});
        if (!mounted) return;
        setAccessToken(response.accessToken);
        setUser(response.user);
      } catch {
        if (!mounted) return;
        setAccessToken(null);
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void refreshSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (USE_MOCK) {
      setUser({ id: "1", email, name: email.split("@")[0], role: "customer" });
      setIsLoading(false);
      return;
    }

    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    setAccessToken(response.accessToken);

    // Merge guest cart into the authenticated cart immediately after login.
    await api.post("/cart/merge", {}, true).catch(() => undefined);
    setUser(response.user);
  }, []);

  const googleLogin = useCallback(async (credential: string) => {
    if (USE_MOCK) {
      const payload = decodeJwtPayload(credential);
      const email =
        typeof payload?.email === "string" && payload.email.trim()
          ? payload.email
          : "google@example.com";
      const name =
        typeof payload?.name === "string" && payload.name.trim()
          ? payload.name
          : email.split("@")[0];

      setUser({
        id: typeof payload?.sub === "string" ? payload.sub : "google-1",
        email,
        name,
        role: "customer",
      });
      setIsLoading(false);
      return;
    }

    const response = await api.post<AuthResponse>("/auth/google", { credential });
    setAccessToken(response.accessToken);
    await api.post("/cart/merge", {}, true).catch(() => undefined);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    if (!USE_MOCK) {
      await api.post("/auth/logout", {}).catch(() => undefined);
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    if (USE_MOCK) {
      setUser({ id: "1", email, name: name || email.split("@")[0], role: "customer" });
      setIsLoading(false);
      return;
    }

    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password,
      name,
    });
    setAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((current) => (current ? { ...current, ...updates } : current));
  }, []);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    googleLogin,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
