import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string
});

//const pineconeIndex = process.env.PINECONE_INDEX! as string

export const pineconeIndex =
  pinecone.Index(process.env.PINECONE_INDEX!);

// await pinecone.createIndex({
//   name: pineconeIndex,
//   dimension: 1024,
//   metric: "cosine",
//   spec: {
//     serverless: {
//       cloud: "aws",
//       region: "us-east-1"
//     }
//   },
// });



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