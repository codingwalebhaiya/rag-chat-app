import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadPdf } from "../controllers/file.controller.js";

const fileRoutes = express.Router();

fileRoutes.post("/upload", upload.single("pdf"), uploadPdf);

export default fileRoutes;
