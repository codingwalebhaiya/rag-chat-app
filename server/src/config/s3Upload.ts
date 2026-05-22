import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsS3 } from "./s3Client.js";

export const uploadPdfToS3 = async (file: any) => {
    console.log(file)

    const key = `pdfs/${Date.now()}-${file.originalname}`;
    console.log(key)

    await awsS3.send(
        new PutObjectCommand({
            Bucket:
                process.env.AWS_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    )

    return key;
}