import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOGGLE_GEMINI_API_KEY!,
  model: 'gemini-1.5-pro'
})