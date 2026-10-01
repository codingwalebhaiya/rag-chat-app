import { redisPublisher } from "../config/pubsub.js";
import { IngestionProgressEvent } from "../types/ingestionProgress.js";


export const getProgressChannel = (conversationId: string) => {
    const channel = `rag-ingestion-progress:${conversationId}`;
    console.log("Channel:", channel);
    return channel;
}



export const publishProgress = async (event: IngestionProgressEvent) => {
    const channel = getProgressChannel(event.conversationId);
    const cacheKey =
        `rag-ingestion-cache:${event.conversationId}`;

    const message = JSON.stringify(event);

    try {
        await redisPublisher.set(`rag-ingestion-cache:${event.conversationId}`, JSON.stringify(event), "EX", 600);
    } catch (err) {
        console.error("Failed to cache progress in Redis:", err);
    }
    await redisPublisher.publish(channel, JSON.stringify(event));
}

