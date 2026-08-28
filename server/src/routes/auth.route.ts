import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authController } from "../controllers/auth.controller.js";


const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authMiddleware, authController.logout);
authRoutes.get("/profile", authMiddleware, authController.profile);
authRoutes.post("/refresh-token", authController.refreshAccessToken);


export default authRoutes;  