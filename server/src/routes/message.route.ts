import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";


const messageRoutes = Router();

messageRoutes.get("/:conversationId", authMiddleware, getMessages);

export default messageRoutes;


