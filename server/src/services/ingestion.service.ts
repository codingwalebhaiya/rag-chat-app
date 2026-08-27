
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone"
import { embeddings } from "../utils/embed.js"
import { pineconeIndex } from "../config/pinecone.js";
import ApiError from "../utils/apiError.js";

interface IngestParams {
  chunksWithMetadata: Document[];
  pineconeNamespace: string;
}

const ingestDocuments = async ({
  chunksWithMetadata,
  pineconeNamespace
}: IngestParams) => {
  
  try {
    if (!chunksWithMetadata || chunksWithMetadata.length === 0) {
      throw new Error("No documents provided for ingestion.");
    }

    await PineconeStore.fromDocuments(
      chunksWithMetadata,
      embeddings,
      {
        pineconeIndex,
        namespace: pineconeNamespace,
      }
    );
    
    console.log(" Ingestion successfully completed into Pinecone Serverless!");
  }
  catch (error) {
    throw new ApiError(500, "Ingestion failed");
  }

} 


export default ingestDocuments;