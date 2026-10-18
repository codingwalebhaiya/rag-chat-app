import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import fileRoutes from "./routes/file.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "rag-api",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/conversations", conversationRoutes);

app.use(errorMiddleware);

export default app;
