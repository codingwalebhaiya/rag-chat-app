import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const gemini = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
  model: 'gemini-3.6-flash', 
  temperature: 0.2, // Lower temperature for more factual, accurate RAG responses
  maxOutputTokens: 500,
})


export const llm = {
  gemini,
  // groq,
  // openai
}
