import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";

export const generateUploadUrl = async (
  fileName: string,
  fileType: string,
  userId: string
) => {
  const fileKey = `documents/${userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60, // 1 minute
  });

  return {
    uploadUrl,
    fileKey,
  };
};