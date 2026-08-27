import { Queue } from "bullmq";
import redisConnection from "../config/redis.config.js";

// Create the document processing queue
export const docsQueue = new Queue("document-ingestion-queue", {
    connection: redisConnection, 
    defaultJobOptions: {
        attempts: 1, // Retry 1 times if processing fails
        backoff: {
            type: "exponential",
            delay: 2000, // Wait 2s before first retry
        },
        removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 100, // Keep last 100 completed jobs
        },
        removeOnFail: {
            age: 24 * 3600, // Keep failed jobs for 24 hours
        },
    },
});


// Add queue event handlers
docsQueue.on("error", (error) => {
    console.error("❌ Queue error:", error);
});

docsQueue.on("waiting", (jobId) => {
    console.log(`⏳ Job ${jobId} waiting in queue`);
});

