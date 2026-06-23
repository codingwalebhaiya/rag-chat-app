import dotenv from "dotenv"
dotenv.config()

// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

// export const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
//   modelName: "gemini-embedding-001", // for mapping text to vectors.
// })

// note - Cohere configuration (embed-english-v3.0) outputs exactly 1024 dimensions

import { CohereEmbeddings } from "@langchain/cohere";

export const queryEmbeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY!, // In Node.js defaults to process.env.COHERE_API_KEY
  batchSize: 48, // Default value if omitted is 48. Max value is 96
  model: "embed-english-v3.0",
  inputType: "search_query",
});

export const documentEmbeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY!,
  batchSize: 48,
  model: "embed-english-v3.0",
  inputType: "search_document",
});






