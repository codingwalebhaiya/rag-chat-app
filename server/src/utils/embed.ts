
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
  model: "gemini-embedding-001", // by default - 3072 dimensions
})
 

// embeddings.embedQuery("hello world").then((res) => {
//   console.log(res)
// })

// 📝 GENERATION MODELS:
// - gemini - 2.5 - flash(fast, cheap, good for RAG)
//   - gemini - 2.5 - pro(better quality, more expensive)
//   - gemini - 1.5 - flash(older, cheaper)

// 🔢 EMBEDDING MODELS:
// - text - embedding-004(768 dimensions) ← RECOMMENDED
//   - embedding-001(768 dimensions, older)
//   - text - embedding-005(1536 dimensions, newer)


// ===================== Important Pinecone + LangChain Tips =============

// ✅ ALWAYS match dimensions (768 for Gemini)
// ✅ USE textKey: "text" to store original text
// ✅ ALWAYS specify namespace for organization
// ✅ USE fromDocuments for initial ingestion
// ✅ USE fromExistingIndex for queries
// ✅ USE similaritySearch for retrieval