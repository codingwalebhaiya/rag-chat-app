import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Register, Login, Logout, Refresh, Profile } from "../api/auth.api";
import { toast } from "sonner";
import { useAuthStore, type UserProfile } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

// Type matching your backend ApiResponse wrapping structure
interface BackendResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface BackendError extends Error {
    success: boolean;
    statusCode: number;
    message: string;
    errors: unknown[];
}

const useRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: Register,
        onSuccess: (res: BackendResponse<UserProfile>) => {
            router.push("/login")
            toast.success(res.message || "User registered successfully");
        },
        onError: (error: BackendError) => {
            toast.error(error.message || "User registration failed");
        }
    });
};

const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth)
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: Login,
        onSuccess: (data) => {
            router.push("/");
            router.refresh();
            toast.success("User logged in successfully");
            // Assuming your login API returns user data inside .data property, update Zustand directly
            if (data?.data) setAuth(data.data);
            // Invalidate profile query to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error: BackendError) => {
            toast.error(error.message || "User login failed");
        }
    });
};

const useLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: Logout,
        onSuccess: () => {
            router.push("/login");
            router.refresh();
            toast.success("User logged out successfully");
            clearAuth();
            queryClient.clear();
        },
        onError: (error: BackendError) => {
            toast.error(error.message || "User logout failed");
        }

    });
};

const useRefresh = () => {
    return useMutation({
        mutationFn: Refresh
    });
};

const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: Profile,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export {
    useRegister,
    useLogin,
    useLogout,
    useRefresh,
    useProfile,
};