import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import fileRoutes from "./routes/file.route.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/files", fileRoutes)
app.use("/api/v1/chat", chatRoutes)

app.get("/", (req, res) => {
    res.send("RAG Backend Running 🚀");
});

app.use(errorMiddleware)

export default app;