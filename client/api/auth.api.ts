import { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import { api } from "./api";

const Register = async (data: RegisterInput) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

const Login = async (data: LoginInput) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

const Logout = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};

const Refresh = async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
};

const Profile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

export {
    Register,
    Login,
    Logout,
    Refresh,
    Profile,
};