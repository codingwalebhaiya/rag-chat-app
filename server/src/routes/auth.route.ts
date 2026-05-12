import { Router } from "express";
import { login, logout, profile, refreshAccessToken, register } from "../controllers/auth.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";


const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.get("/me", authMiddleware, profile);
authRoutes.post("/refresh-token", refreshAccessToken);


export default authRoutes;  