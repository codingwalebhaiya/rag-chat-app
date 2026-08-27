// src/config/bullmq.ts
import { Redis } from "ioredis";
import redisConfig from "./redis.config.js";

// Create Redis connection for BullMQ
const bullmqConnection = new Redis(redisConfig);

// Handle connection events
bullmqConnection.on("connect", () => {
    console.log("✅ BullMQ Redis connected successfully");
});

bullmqConnection.on("ready", () => {
    console.log("✅ BullMQ Redis ready to accept commands");
});

bullmqConnection.on("error", (error) => {
    console.error("❌ BullMQ Redis connection error:", error.message);

    // Don't crash the app on Redis errors
    // BullMQ will try to reconnect
});

bullmqConnection.on("close", () => {
    console.warn("⚠️ BullMQ Redis connection closed");
});

bullmqConnection.on("reconnecting", (delay: number) => {
    console.log(`🔄 BullMQ Redis reconnecting in ${delay}ms`);
});

bullmqConnection.on("end", () => {
    console.error("❌ BullMQ Redis connection ended permanently");
});

// Handle process termination
process.on('SIGINT', async () => {
    console.log("Gracefully shutting down...");
    await bullmqConnection.quit();
    process.exit(0);
});

export default bullmqConnection;