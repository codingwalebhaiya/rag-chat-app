import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { conversationController } from "../controllers/conversation.controller.js";

const conversationRoutes = Router();

conversationRoutes.use(authMiddleware)

// user query endpoint
conversationRoutes.post("/:conversationId/query", conversationController.userQuery)

//  returns PDF URL + ALL messages
conversationRoutes.get(
    "/:conversationId",
    conversationController.conversation
);

// get all conversation for sidebar
conversationRoutes.get(
    "/",
    conversationController.getAllConversations
)

// Delete conversation - with file deletion from s3 and pinecone namespace and mongodb (conversation and messages and file)
// Delete conversation
//       ↓
// cancel jobs
//       ↓
// delete vectors
//       ↓
// delete S3
//       ↓
// delete file metadata
conversationRoutes.delete(
    "/:conversationId",
    conversationController.deleteConversation
);
export default conversationRoutes;