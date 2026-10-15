import Conversation from "../models/conversation.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { docsQueue } from "../queue/docsQueue.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadPresignedUrl from "../utils/generateUploadPresignedUrl.js";
import { redisPublisher, redisSubscriber } from "../config/pubsub.js";
import { getProgressChannel } from "../services/ingestionProgress.service.js";
import mongoose from "mongoose";
import { IngestionProgressEvent } from "../types/ingestionProgress.js";
import { z } from "zod";

// ===== STEP 1: Generate Upload URL =====
const getUploadUrl = asyncHandler(async (req, res) => {
  // validate body
  const uploadUrlSchema = z.object({
    fileName: z.string().min(1, "Filename is required"),
    fileSize: z.number().min(1, "File size is required"),
    mimeType: z.string().min(1, "Mime type is required"),
  });

  const { fileName, fileSize, mimeType } = uploadUrlSchema.parse(req.body);
  const userId = req.user?.id;

  // validate file size and type
  if (fileSize > 5 * 1024 * 1024) {
    // 5MB
    throw new ApiError(400, "File size should be less than 5MB");
  }

  if (!mimeType.startsWith("application/pdf")) {
    throw new ApiError(400, "Only PDF files are allowed");
  }

  // Clean filename
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

  // create pinecone namespace
  const namespace = `tenant_user_${userId.toString()}`;
  const s3FileKey = `docs/${userId.toString()}/${Date.now()}-${safeFileName}`;

  // Generate PUT presigned URL for direct browser upload
  const presignedUrl = await uploadPresignedUrl(s3FileKey, mimeType);
  if (!presignedUrl) {
    throw new ApiError(500, "Failed to generate presigned URL");
  }

  // Create File document in MongoDB
  const file = await File.create({
    userId,
    fileName: safeFileName,
    fileSize,
    mimeType,
    s3FileKey,
    pineconeNamespace: namespace,
  });

  // create conversation document in MongoDB
  const conversation = await Conversation.create({
    userId,
    fileId: file._id,
    title: safeFileName,
  });

  // send response with presigned url and upload pdf file from frontend to aws s3
  return res.status(200).json(
    new ApiResponse(201, "Upload URL generated successfully ", {
      presignedUrl,
      s3Key: s3FileKey,
      conversationId: conversation._id.toString(),
      fileId: file._id.toString(),
      fileStatus: file.fileStatus,
    }),
  );
});

// ===== STEP 2: Confirm Upload & Start Processing =====
const confirmUploadAndProcess = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { s3Key, conversationId } = req.body;

  if (!s3Key || !conversationId) {
    throw new ApiError(400, "All fields are required");
  }

  // Find conversation and populate file
  const conversation =
    await Conversation.findById(conversationId).populate("fileId");
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  // Access the populated file
  const file = conversation.fileId;

  if (!file) {
    throw new ApiError(404, "File not found in conversation");
  }

  // Verify that the s3Key matches the file's s3FileKey
  if (file.s3FileKey !== s3Key) {
    throw new ApiError(400, "S3 key does not match the file");
  }

  // Get the pinecone namespace from the file
  const pineconeNamespace = file.pineconeNamespace;

  // Verify ownership
  if (file.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  // Check if file is already being processed
  if (file.jobId) {
    throw new ApiError(400, "File is already being processed");
  }

  // Check if conversation is already active
  if (conversation.conversationStatus) {
    throw new ApiError(400, "Conversation is already active");
  }


  // Add BullMQ job for background processing
  const job = await docsQueue.add(
    "document-ingestion-queue",
    {
      fileName: file.fileName,
      fileId: file._id.toString(),
      conversationId: conversation._id.toString(),
      s3Key,
      pineconeNamespace,
    },
    {
      jobId: `docs-${file._id}`,
      priority: 1,
    },
  );

  // Update jobId and fileStatus in file document and mark conversation as active
  // await Promise.all([
  //   File.updateOne({ _id: file._id }, { jobId: job.id, fileStatus: "processing" }),
  //   Conversation.updateOne(
  //     { _id: conversation._id },
  //     { conversationStatus: true },
  //   ),
  // ]);

  // Promise.all() means -> Update both at the same time
  // But if any of the two fails, then both will fail
  // So we need to use await Promise.all()

  // update file status to processing
  await File.updateOne(
    { _id: file._id },
    {
      jobId: job.id,
      fileStatus: "processing",
      ingestionProgressStatus: "downloading",
      ingestionProgressPercentage: 5,
      ingestionProgressMessage: "Initializing document ingestion...",
    },
  );

  // Send response to frontend
  return res.status(200).json(
    new ApiResponse(200, "File processing started", {
      jobId: job.id,
      fileStatus: "processing",
      ingestionProgressStatus: "downloading",
    }),
  );
});

export const streamRagIngestionProgress = asyncHandler(async (req, res) => {
  const { conversationId } = req.params as { conversationId: string };

  if (!mongoose.isValidObjectId(conversationId)) {
    throw new ApiError(400, "Invalid conversation ID");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId: req.user.id,
  }).populate("fileId");

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const file = conversation.fileId as any;

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const channel = getProgressChannel(conversationId);
  const subscriber = redisSubscriber.duplicate();

  let closed = false;
  let buffering = true;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const bufferedEvents: any[] = [];

  const sendEvent = (event: unknown) => {
    if (closed || res.destroyed) return;

    res.write("event: progress\n");
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const onMessage = (receivedChannel: string, message: string) => {
    if (receivedChannel !== channel || closed) return;

    try {
      const event = JSON.parse(message);

      if (buffering) {
        bufferedEvents.push(event);
      } else {
        sendEvent(event);
      }
    } catch (error) {
      console.error("[SSE] Invalid progress message", error);
    }
  };

  const cleanup = async () => {
    if (closed) return;
    closed = true;

    if (heartbeat) clearInterval(heartbeat);

    subscriber.removeListener("message", onMessage);

    try {
      await subscriber.unsubscribe(channel);
    } catch {
      // Connection may already be closed.
    }

    try {
      await subscriber.quit();
    } catch {
      subscriber.disconnect();
    }
  };

  subscriber.on("message", onMessage);

  subscriber.on("error", (error) => {
    console.error("[SSE] Redis subscriber error:", error);
    void cleanup();

    // The client can reconnect and fetch a fresh snapshot.
    if (!res.writableEnded) res.end();
  });

  res.on("close", () => {
    void cleanup();
  });

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  try {
    // Subscribe BEFORE reading the snapshot.
    await subscriber.subscribe(channel);

    if (closed || res.destroyed) {
      await cleanup();
      return;
    }

    // MongoDB snapshot works even if Redis cache has expired.
    const latestFile = await File.findById(file._id).lean();

    if (!latestFile) {
      await cleanup();
      if (!res.destroyed) res.end();
      return;
    }

    sendEvent({
      fileId: String(latestFile._id),
      conversationId,
      status: latestFile.ingestionProgressStatus,
      progress: (latestFile as any).ingestionProgressPercentage ?? 0,
      message: (latestFile as any).ingestionProgressMessage ?? "Waiting for ingestion",
      error: (latestFile as any).ingestionProgressError ?? null,
    });

    // Now forward live events received during snapshot loading.
    buffering = false;

    for (const event of bufferedEvents) {
      sendEvent(event);
    }

    bufferedEvents.length = 0;

    heartbeat = setInterval(() => {
      if (!closed && !res.destroyed) {
        res.write(": heartbeat\n\n");
      }
    }, 15000);
  } catch (error) {
    console.error("[SSE] Failed to start stream:", error);

    await cleanup();

    if (!res.headersSent) {
      res.status(500).end();
    } else if (!res.destroyed) {
      res.end();
    }
  }
});

export const fileController = {
  getUploadUrl,
  confirmUploadAndProcess,
  streamRagIngestionProgress,
};
