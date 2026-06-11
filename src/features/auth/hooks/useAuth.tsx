"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser } from "@/shared/types";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (u: AuthUser) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("medium_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("medium_user", JSON.stringify(data.user));
    return true;
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("medium_user", JSON.stringify(data.user));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medium_user");
  };

  const updateUser = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("medium_user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
