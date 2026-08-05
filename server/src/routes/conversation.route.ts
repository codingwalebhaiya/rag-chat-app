import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { conversationController } from "../controllers/conversation.controller.js";

const conversationRoutes = Router();

conversationRoutes.use(authMiddleware)

// ai assistant generated response send to frontend
conversationRoutes.post("/:conversationId/messages", conversationController.userQuery)

// get all messages of single conversation 
conversationRoutes.get(
    "/:conversationId/messages",
    conversationController.getConversationMessages
);

// get all conversation for sidebar
conversationRoutes.get(
    "/",
    conversationController.getAllConversations
)

// // Delete conversation
conversationRoutes.delete(
    "/:conversationId",
    conversationController.deleteConversation
);
export default conversationRoutes;