import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { chatWithDocs } from "../controllers/chat.controller.js";


const chatRoutes = Router();

chatRoutes.post("/", authMiddleware, chatWithDocs)

export default chatRoutes;