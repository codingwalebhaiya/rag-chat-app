import { env } from "./env.js";
import { Redis } from "ioredis";

const redisUrl = env.UPSTASH_REDIS_URL;

const redisPublisher = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    connectTimeout: 100000,
});
const redisSubscriber = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    connectTimeout: 100000,
});


redisPublisher.on("error", (err) => {
    console.error("❌ Redis Publisher Error:", err);
});

redisSubscriber.on("error", (err) => {
    console.error("❌ Redis Subscriber Error:", err);
});

export {
    redisPublisher,
    redisSubscriber
} 