import { redisPublisher } from "../config/pubsub.js";
import File from "../models/file.model.js";
import { IngestionProgressEvent } from "../types/ingestionProgress.js";

export const getProgressChannel = (conversationId: string) => {
  const channel = `rag-ingestion-progress:${conversationId}`;
  return channel;
};

export const getProgressCacheKey = (conversationId: string) => {
  const cacheKey = `rag-ingestion-cache:${conversationId}`;
  return cacheKey;
};

export const publishProgress = async (event: IngestionProgressEvent) => {
  const channel = getProgressChannel(event.conversationId);
  const cacheKey = getProgressCacheKey(event.conversationId);
  const message = JSON.stringify({
    ...event,
    updatedAt: new Date().toISOString(),
  });

  // MongoDB is the durable source of truth for audit purposes & for rehydration of state when Redis is unavailable
  await File.updateOne(
    { _id: event.fileId },
    {
      $set: {
        ingestionProgressStatus: event.status,
        ingestionProgressPercentage: event.progress,
        ingestionProgressMessage: event.message,
        ingestionProgressError: event.status === "failed" ? event.error : null,
        fileStatus:
          event.status === "completed"
            ? "ready"
            : event.status === "failed"
              ? "failed"
              : "processing",
      },
    },
  );

  // Redis is for low latency pub/sub & caching of the progress data for quick client retrieval
  // We cache the latest progress for each conversation with a 10-minute TTL (600 seconds) to prevent memory leaks
  await redisPublisher.set(cacheKey, message, "EX", 600);

  // send live event to the API server's subscribers via Redis Pub/Sub
  // the API server will then forward the event to the frontend using SSE (Server-Sent Events)
  await redisPublisher.publish(channel, message);
  console.log(
    `[PublishProgress] Published progress for conversation ${event.conversationId}: ${event.status} - ${event.progress}% - ${event.message}`,
  );
};
