import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("RAG Backend Running 🚀");
});

app.use(errorMiddleware)

export default app;