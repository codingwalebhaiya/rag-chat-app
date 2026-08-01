import { create } from "zustand"


export interface UserProfile {
    id: string;
    name?: string;
    username: string;
    email: string;
    role: "user" | "admin"
}

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    setAuth: (user: UserProfile) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setAuth: (user) => set({ user, isAuthenticated: true }),
    clearAuth: () => set({ user: null, isAuthenticated: false })
}))

