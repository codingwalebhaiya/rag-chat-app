import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string
});

const indexName = process.env.PINECONE_INDEX! as string

await pc.createIndex({
  name: indexName,
  dimension: 1024,
  metric: "cosine",
  spec: {
    serverless: {
      cloud: "aws",
      region: "us-east-1"
    }
  },
});
