import { Pinecone } from "@pinecone-database/pinecone";
import { embeddings } from "../utils/embed.js";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
})

const index = pc.index(process.env.PINECONE_INDEX!);

export const retrieveContext = async (query: string, namespaceId: string)=>{
    const namespace = index.namespace(namespaceId);
    const vector = await embeddings.embedQuery(query);
    const results = await namespace.query({
        topK: 5,
        vector,
        includeMetadata: true
    })

    return results.matches?.map(match => match.metadata?.text).join('\n\n') || ''
}