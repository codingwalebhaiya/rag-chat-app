import dotenv from "dotenv"
dotenv.config()
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import s3Client from "../config/s3Client.js"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import ApiError from "./apiError.js";


// Presigned URL for upload pdf (PUT) - For Frontend → S3
const uploadPresignedUrl = async (fileKey: string, mimeType: string): Promise<string> => {

    try {

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            ContentType: mimeType
        })

        const signedUrl = await getSignedUrl(
            s3Client,
            command,
            { expiresIn: 300 } // 5 minutes
        );
        return signedUrl;


    } catch (error) {
        throw new ApiError(500, "Failed to generate presigned URL")
    }

}

export default uploadPresignedUrl;


