import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { env } from "./env.js"

const gemini = new ChatGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
  model: 'gemini-3.6-flash',
  temperature: 0, // Lower temperature for more factual, accurate RAG responses
  maxOutputTokens: 5000 
})
 

export const llm = {
  gemini,
  // groq,
  // openai
}
