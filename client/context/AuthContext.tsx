"use client"

import api from "@/lib/axios";
import { LoginInputCredentials, RegisterInputCredentials } from "@/schemas/auth.schema";
import { User } from "@/types/auth.types";
import { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    login: (data: LoginInputCredentials) => Promise<void>;
    register: (data: RegisterInputCredentials) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    const fetchProfile = async (): Promise<void> => {
        try {
            const res = await api.get("/auth/profile");
            console.log(res.data)
            setUser(res.data.user);
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: RegisterInputCredentials) : Promise<void> => {
       const res = await api.post("/auth/register", data);
       console.log(res)
       setUser(res.data.user)
    }

    const login = async (data: LoginInputCredentials): Promise<void> => {
        const res = await api.post("/auth/login", data);
        console.log(res)
        setUser(res.data.user);
    };

    const logout = async () : Promise<void> => {
        await api.post("/auth/logout");
        setUser(null);
    };

    useEffect(() => {
        fetchProfile();
    }, []);


    const value = {
        user,
        loading,
        setLoading,
        register,
        login,
        logout,
        fetchProfile,
        
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)!;