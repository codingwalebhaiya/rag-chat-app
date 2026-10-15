// import dotenv from "dotenv";

// dotenv.config();

// export const env = {
//     PORT: process.env.PORT,
//     MONGO_URI: process.env.MONGO_URI,
//     GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
//     AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
//     AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
//     AWS_REGION: process.env.AWS_REGION,
//     AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
//     UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
//     PINECONE_API_KEY: process.env.PINECONE_API_KEY,
//     PINECONE_INDEX: process.env.PINECONE_INDEX,
//     CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY,
//     CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID,
//     CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
//     JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
//     JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,

// }

// for (const [key, value] of Object.entries(env)) {
//     if (!value) {
//         console.error(`❌ Missing environment variable: ${key}`);
//     }
//     else {

//         console.log(`✅ ${key}: ${value}`);
//     }
// }

import dotenv from "dotenv";
dotenv.config();
import z from "zod";

const envSchema = z.object({
    NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    GOOGLE_GEMINI_API_KEY: z.string().min(1, "GOOGLE_GEMINI_API_KEY is required"),
    AWS_ACCESS_KEY: z.string().min(1, "AWS_ACCESS_KEY is required"),
    AWS_SECRET_KEY: z.string().min(1, "AWS_SECRET_KEY is required"),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),
    UPSTASH_REDIS_URL: z.string().min(1, "UPSTASH_REDIS_URL is required"),
    PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required"),
    PINECONE_INDEX: z.string().min(1, "PINECONE_INDEX is required"),
    CLOUDFRONT_PRIVATE_KEY: z.string().min(1, "CLOUDFRONT_PRIVATE_KEY is required"),
    CLOUDFRONT_KEY_PAIR_ID: z.string().min(1, "CLOUDFRONT_KEY_PAIR_ID is required"),
    CLOUDFRONT_DOMAIN: z.string().min(1, "CLOUDFRONT_DOMAIN is required"),
    JWT_ACCESS_SECRET_KEY: z.string().min(1, "JWT_ACCESS_SECRET_KEY is required"),
    JWT_REFRESH_SECRET_KEY: z.string().min(1, "JWT_REFRESH_SECRET_KEY is required"),
    FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),

}) 

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(`❌ Missing environment variables: ${result.error.issues.map(issue => issue.message).join(", ")}`);
    process.exit(1);
}

export const env = result.data;