import { create } from "zustand"


interface UserProfile {
     id: string;
     name?:string;
    username: string;
    email: string;
    role: "USER" | "ADMIN"
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

// Global client event engine listener to handle unexpected global auth dropouts
if (typeof window !== "undefined") {
    window.addEventListener("auth-logout", () => {
        useAuthStore.getState().clearAuth();
    });
}