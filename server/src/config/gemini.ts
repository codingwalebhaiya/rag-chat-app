import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
  model: 'gemini-2.5-flash',
  temperature: 0.3 // Lower temperature for more factual, accurate RAG responses
})