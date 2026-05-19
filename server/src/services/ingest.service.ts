import { embeddings } from '../utils/embed.js'
import crypto from "crypto"
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.Index(process.env.PINECONE_INDEX!)

export const ingestChunks = async (docs: any[], docId: string, namespaceId: string) => {
  const namespace = index.namespace(namespaceId);

  const texts = docs.map(doc => doc.pageContent)
  const vectors = await embeddings.embedDocuments(texts)

  console.log(vectors)

  
  console.log(
    "vectors:",
    vectors.length
  );

  console.log(
    "dimension:",
    vectors[0]?.length
  );


  if (
    !vectors.length ||
    !vectors[0]?.length
  ) {
    throw new Error(
      "Embedding failed"
    );
  }

  const records = vectors.map((vector, i) => ({
    id: crypto.randomUUID(),
    values: vector,
    metadata: {
      text: texts[i],
      docId
    }

  })
  )

  // console.log(records)


  await namespace.upsert({ records })
}