import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { Document } from "@langchain/core/documents";

export interface ChunkMetadata {
    fileId: string;
    fileName: string;
    userId: string;
    namespace: string;
    pageNumber: number;
    chunkIndex: number;
    // contentLength: number;

}

interface SplitDocumentsOptions {
    documents: Document[];
    fileId: string;
    fileName: string;
    userId: string;
    namespace: string;
}


export const splitDocuments = async ({
    documents,
    fileId,
    fileName,
    userId,
    namespace

}: SplitDocumentsOptions) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1200,
        chunkOverlap: 250,
    })

    const chunkDocuments = await textSplitter.splitDocuments(documents);
    return chunkDocuments.map((chunkDocument, chunkIndex) => {

        const metadata: ChunkMetadata = {
            fileId,
            fileName,
            userId,
            namespace,
            pageNumber: chunkDocument.metadata.pageNumber ?? 1,
            chunkIndex: chunkIndex,
            // contentLength: doc.pageContent.length,
        }

        return new Document<ChunkMetadata>({
            id: `${fileId}_chunk_${chunkIndex}`,
            pageContent: chunkDocument.pageContent,
            metadata,
        })
    })


}