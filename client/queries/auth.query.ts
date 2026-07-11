import { useMutation, useQuery } from "@tanstack/react-query";
import { Register, Login, Logout, Refresh, Profile } from "../api/auth.api";
import { toast } from "sonner";


const useRegister = () => {
    return useMutation({
        mutationFn: Register,
        onSuccess: () => {
            toast.success("User registered successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

const useLogin = () => {
    return useMutation({
        mutationFn: Login,
        onSuccess: () => {
            toast.success("User logged in successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

const useLogout = () => {
    return useMutation({
        mutationFn: Logout,
        onSuccess: () => {
            toast.success("User logged out successfully");
        },
        onError: (error) => {
            toast.error(error.message);
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
    });
};

export {
    useRegister,
    useLogin,
    useLogout,
    useRefresh,
    useProfile,
};