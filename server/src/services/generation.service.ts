import { llm } from "../config/gemini.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RetrievedChunk } from "./retrieval.service.js";

interface GenerateAnswerOptions {
    query: string;
    chunks: RetrievedChunk[];
}

export const generateAnswer = async ({ query, chunks }: GenerateAnswerOptions): Promise<string> => {

    const contextText =
        chunks
            .map(
                (chunk, index) => `
[${index + 1}]
File: ${chunk.fileName}
Page: ${chunk.pageNumber}

${chunk.content}
`
            )
            .join("\n\n---\n\n");

    const systemMessage =
        new SystemMessage(`
You are a helpful RAG assistant.

Rules:

1. Answer ONLY from provided context.
2. If answer is not found say:
   "The information is not available in the uploaded document."
3. Use markdown.
4. Cite sources using [1], [2], etc.
5. At end create Sources section.
`);

    const humanMessage =
        new HumanMessage(`
Context:

${contextText}

Question:

${query}
`);

    const response =
        await llm.invoke([
            systemMessage,
            humanMessage,
        ]);

    return response.content as string;
}




