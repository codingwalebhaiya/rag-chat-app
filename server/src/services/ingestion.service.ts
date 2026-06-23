
import { z } from "zod";
import { documentEmbeddings } from "../utils/embed.js";
import { pineconeIndex } from "../config/pinecone.js";

const PineconeMetadataSchema =
  z.object({
    fileId: z.string(),
    fileName: z.string(),
    userId: z.string(),
    pageNumber: z.number(),
    chunkIndex: z.number(),
  });

export const ingestDocuments = async (
  chunkDocuments: any[],
  namespace: string
) => {

  const pineconeNamespace =
    pineconeIndex.namespace(namespace);

  const chunkTexts =
    chunkDocuments.map(
      chunk => chunk.pageContent
    );

  const embeddings =
    await documentEmbeddings.embedDocuments(
      chunkTexts
    );

  const records =
    embeddings.map(
      (embedding, index) => {

        const metadata =
          PineconeMetadataSchema.parse(
            chunkDocuments[index].metadata
          );

        return {
          id:
            chunkDocuments[index].id ??
            `${metadata.fileId}_chunk_${index}`,

          values: embedding,

          metadata: {
            text: chunkDocuments[index].pageContent,
            fileId: metadata.fileId,
            fileName: metadata.fileName,
            userId: metadata.userId,
            pageNumber:
              metadata.pageNumber,
            chunkIndex:
              metadata.chunkIndex,
          },
        };
      }
    );

  await pineconeNamespace.upsert({
    records,
  });
  console.log("ingestion done", records[0]);
};