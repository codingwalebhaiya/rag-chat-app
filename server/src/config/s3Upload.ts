import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "./s3Client.js"


const uploadToS3 = async (fileKey: string, file: Buffer, mimeType: string, originalName: string, userId: string) => {
    const uploadResult = await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Body: file, 
        ContentType: mimeType,
        Metadata: {
            originalName: originalName,
            userId: userId,
        }
    }))

    return uploadResult;
}
export default uploadToS3;