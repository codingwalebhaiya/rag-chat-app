import dotenv from "dotenv"
dotenv.config();
import { connectDB } from "../config/db.js";

// first - connect to mongodb 
connectDB().then(() => {
    console.log("✅ MongoDB connected for worker");
    // then start the worker server
    import("../worker/docs.worker.js");
    console.log("✅ Document worker started");
}).catch(err => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
});