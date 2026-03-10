"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authenticate, initStore, Location, getLocationsByBusiness } from "./store";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    activeLocation: Location | null;
    setActiveLocation: (loc: Location | null) => void;
    availableLocations: Location[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLocation, setActiveLocation] = useState<Location | null>(null);
    const [availableLocations, setAvailableLocations] = useState<Location[]>([]);

    useEffect(() => {
        initStore();
        const saved = sessionStorage.getItem("rms_current_user");
        if (saved) {
            try {
                const pUser = JSON.parse(saved);
                setUser(pUser);
            } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user && user.businessId) {
            const locs = getLocationsByBusiness(user.businessId);
            setAvailableLocations(locs);
            if (locs.length > 0) {
                // If they have a pref in storage, try to use it
                const savedLoc = sessionStorage.getItem("rms_active_location");
                if (savedLoc) {
                    const parsed = JSON.parse(savedLoc);
                    const match = locs.find(l => l.id === parsed.id);
                    setActiveLocation(match || locs[0]);
                } else {
                    setActiveLocation(locs[0]);
                }
            } else {
                setActiveLocation(null);
            }
        } else {
            setAvailableLocations([]);
            setActiveLocation(null);
        }
    }, [user]);

    const handleSetActiveLocation = (loc: Location | null) => {
        setActiveLocation(loc);
        if (loc) {
            sessionStorage.setItem("rms_active_location", JSON.stringify(loc));
        } else {
            sessionStorage.removeItem("rms_active_location");
        }
    };

    const login = async (email: string, password: string) => {
        const found = authenticate(email, password);
        if (found) {
            setUser(found);
            sessionStorage.setItem("rms_current_user", JSON.stringify(found));
            return { success: true };
        }
        return { success: false, error: "Invalid email or password" };
    };

    const logout = () => {
        setUser(null);
        setActiveLocation(null);
        setAvailableLocations([]);
        sessionStorage.removeItem("rms_current_user");
        sessionStorage.removeItem("rms_active_location");
    };

    return (
        <AuthContext.Provider value={{
            user, loading, login, logout,
            activeLocation, setActiveLocation: handleSetActiveLocation, availableLocations
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
