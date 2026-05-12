import { Pinecone } from '@pinecone-database/pinecone'
import { embeddings } from '../utils/embed.js'
import crypto from "crypto"

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const index = pc.index(process.env.PINECONE_INDEX!)

export const ingestChunks = async (docs: any[], docId: string, namespaceId: string) => {
  const namespace = index.namespace(namespaceId);

  const texts = docs.map(doc => doc.pageContent)
  const vectors = await embeddings.embedDocuments(texts)

  const records = vectors.map((vector, i) => ({
    id: crypto.randomUUID(),
    values: vector,
    metadata: {
      text: texts[i],
      docId
    }

  })
  )


  await namespace.upsert({records})
}