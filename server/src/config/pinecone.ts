//import { Pinecone } from '@pinecone-database/pinecone';
// import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
  
// const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY! });
// export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
export const pineconeIndex = pc.index(process.env.PINECONE_INDEX!);


 //Optimization Checklist for Fast & Proper RAGTo ensure
 //your Generation phase works properly and fast, apply these architectural settings:

 // ------------------ 1- Verify Vector Dimension Mapping ------------------ 
 //You created your Pinecone index with a dimension size of 1024.
 // Make sure your Cohere configuration (embed-english-v3.0) outputs exactly 1024 dimensions. (Cohere v3 defaults to 1024, so this matches perfectly).
 
 // ----------------- 2- Top-K Retrieval Tuning ------------------
 // When querying Pinecone for generation, do not fetch too many chunks.
  //Fetching topK: 4 or topK: 5 balances context completeness with LLM speed.

  // ----------------- 3- Namespace Isolation -------------
  // Your choice to use req.user.id as the namespace is an excellent multi-tenancy choice. It keeps user data completely isolated and ensures lightning-fast queries since
  // Pinecone only scans vectors belonging to that specific user.