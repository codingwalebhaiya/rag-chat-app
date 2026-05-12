import dotenv from "dotenv"
dotenv.config()

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'



export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOGGLE_GEMINI_API_KEY!
})