import express from "express";
import getUploadUrl from "../controllers/upload.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const uploadRoutes = express.Router();

uploadRoutes.post("/url", authMiddleware ,  getUploadUrl);

export default uploadRoutes;