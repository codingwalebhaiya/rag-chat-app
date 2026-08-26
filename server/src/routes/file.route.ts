import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { fileController } from "../controllers/file.controller.js";

const fileRoutes = express.Router();

fileRoutes.use(authMiddleware);

fileRoutes.post("/presigned-url", fileController.getUploadUrl);
fileRoutes.post("/file-process", fileController.confirmUploadAndProcess);


export default fileRoutes;
