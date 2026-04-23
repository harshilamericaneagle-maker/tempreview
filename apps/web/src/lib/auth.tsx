"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string | null;
  } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  activeLocation: { id: string; name: string } | null;
  setActiveLocation: (loc: { id: string; name: string } | null) => void;
  availableLocations: { id: string; name: string }[];
}

type AppLocation = { id: string; name: string };

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [activeLocation, setActiveLocation] = useState<AppLocation | null>(null);
  const [availableLocations, setAvailableLocations] = useState<AppLocation[]>([]);

  useEffect(() => {
    setAvailableLocations([]);
    setActiveLocation(null);
  }, [session?.user?.tenantId]);

  useEffect(() => {
    if (!session?.user?.tenantId) return;

    const loadLocations = async () => {
      const res = await fetch("/api/locations");
      const json = (await res.json()) as {
        ok: boolean;
        data: Array<{ id: string; name: string }>;
      };
      if (!json.ok) return;

      setAvailableLocations(json.data);
      const stored = sessionStorage.getItem("rms_active_location");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { id: string; name: string };
          const match = json.data.find((l) => l.id === parsed.id);
          if (match) {
            setActiveLocation(match);
            return;
          }
        } catch {
          // Ignore invalid stored payload.
        }
      }

      if (json.data[0]) setActiveLocation(json.data[0]);
    };

    void loadLocations();
  }, [session?.user?.tenantId]);

  const handleSetActiveLocation = (loc: AppLocation | null) => {
    setActiveLocation(loc);
    if (loc) {
      sessionStorage.setItem("rms_active_location", JSON.stringify(loc));
    } else {
      sessionStorage.removeItem("rms_active_location");
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result?.error) {
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setActiveLocation(null);
    setAvailableLocations([]);
    void signOut({ callbackUrl: "/login" });
  };

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        tenantId: session.user.tenantId,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        login,
        logout,
        activeLocation,
        setActiveLocation: handleSetActiveLocation,
        availableLocations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
