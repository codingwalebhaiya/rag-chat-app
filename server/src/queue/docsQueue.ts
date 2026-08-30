import { Queue } from "bullmq";
import redisConnection from "../config/redis.config.js";

// Create the document processing queue
export const docsQueue = new Queue("document-ingestion-queue", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 2, // Retry 2 times if processing fails
        backoff: {
            type: "exponential",
            delay: 5000, // Wait 5s before first retry
        },
        removeOnComplete: 100,
        removeOnFail: 100,
    },
});


// Add queue event handlers
docsQueue.on("error", (error) => {
    console.error("❌ Queue error:", error);
});

docsQueue.on("waiting", (jobId) => {
    console.log(`⏳ Job ${jobId} waiting in queue`);
});

