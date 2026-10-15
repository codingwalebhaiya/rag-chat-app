import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.js";

// initialize s3 client
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export default s3Client;
