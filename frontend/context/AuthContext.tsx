"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, loginUser, signupUser } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, passwordString: string) => Promise<void>;
  signup: (name: string, email: string, passwordString: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    async function initAuth() {
      try {
        const isClient = typeof window !== "undefined";
        const savedToken = isClient ? localStorage.getItem("userToken") : null;
        if (savedToken) {
          try {
            const profile = await getUserProfile(savedToken);
            setToken(savedToken);
            setUser(profile);
          } catch (err) {
            console.error("Token validation failed, logging out...", err);
            if (isClient) {
              localStorage.removeItem("userToken");
            }
          }
        }
      } catch (err) {
        console.error("Authentication initialization failed:", err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  // Handle Login
  const login = async (email: string, passwordString: string) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, passwordString });
      localStorage.setItem("userToken", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  // Handle Signup
  const signup = async (name: string, email: string, passwordString: string) => {
    setLoading(true);
    try {
      const data = await signupUser({ name, email, passwordString });
      localStorage.setItem("userToken", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  // Handle Logout
  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
