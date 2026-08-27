// all Redis connections use the same configuration -
// src/config/redis.config.ts
import dotenv from "dotenv"
dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD === 'default' ? undefined : process.env.REDIS_PASSWORD,
    // db: Number(process.env.REDIS_DB) || 0,

    // Essential for BullMQ
    maxRetriesPerRequest: null,
    enableReadyCheck: false
};

export default redisConfig;