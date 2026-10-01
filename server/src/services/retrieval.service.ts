import { embeddings } from "../config/embed.js";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "../config/pinecone.js";
import { DocumentInterface } from "@langchain/core/documents";
 
export interface IRetrieveParams {
    userQuery: string;
    fileId: string;
    namespace: string
}

export const retrieveContext = async ({
    userQuery,
    fileId,
    namespace
}: IRetrieveParams) => {

    const vectorStore =
        await PineconeStore.fromExistingIndex(
            embeddings,
            {
                pineconeIndex,
                namespace

            }
        );

    //console.log("vector store", vectorStore)

    const docs: DocumentInterface[] = await
        vectorStore.similaritySearch(
            userQuery,
            5, // top k - number of chunks to retrieve
              {
                fileId:fileId // Filter applied at database level via file id  
                  // Pre-filtering (Recommended): Filter in Pinecone before similarity search
              }
            

        )

    return docs


}



// Pre-filtering vs Post-filtering

// export class OptimizedRetrieval {
//     // Pre-filtering (Recommended): Filter in Pinecone before similarity search
//     async retrieveWithPreFilter(userQuery: string, fileId: string) {
//         // More efficient - only searches relevant vectors
//         const docs = await vectorStore.similaritySearch(
//             userQuery, 
//             5, 
//             { fileId }  // Filter applied at database level
//         );
//         return docs;
//     }
    
//     // Post-filtering: Retrieve more, then filter in memory
//     async retrieveWithPostFilter(userQuery: string, fileId: string) {
//         // Less efficient but useful for complex logic
//         const allDocs = await vectorStore.similaritySearch(userQuery, 20);
        
//         // Filter in memory
//         const filteredDocs = allDocs.filter(
//             doc => doc.metadata.fileId === fileId
//         );
        
//         return filteredDocs.slice(0, 5);
//     }
// }