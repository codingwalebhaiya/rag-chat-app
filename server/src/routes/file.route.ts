import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteFile, getFile, uploadPdf } from "../controllers/file.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const fileRoutes = express.Router();

fileRoutes.post("/upload", authMiddleware, upload.single("pdf"), uploadPdf);
fileRoutes.get("/:fileId", authMiddleware, getFile);
fileRoutes.delete("/:fileId", authMiddleware, deleteFile);

export default fileRoutes;
