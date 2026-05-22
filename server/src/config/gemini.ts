import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
  //model: 'gemini-1.5-pro'
  model: 'gemini-1.5-flash'
  //gemini-2.5-flash for blindingly fast and intelligent text generation.

})