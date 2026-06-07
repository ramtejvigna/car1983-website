"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "car1983.admin.token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const savedToken = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
        
        // Fetch session status from Next.js proxy route
        const response = await fetch("/api/admin/auth/me");
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken(savedToken);
        } else {
          setUser(null);
          setToken(null);
          if (savedToken) {
            window.localStorage.removeItem(TOKEN_KEY);
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    void checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Invalid credentials" };
      }

      const { accessToken, admin } = data;
      
      setUser(admin);
      setToken(accessToken);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, accessToken);
      }

      router.push("/");
      return { success: true };
    } catch (err) {
      console.error("Login request failed:", err);
      return { success: false, error: "An unexpected error occurred. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      router.push("/login");
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
