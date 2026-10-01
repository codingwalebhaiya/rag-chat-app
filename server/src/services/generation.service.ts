import { ChatPromptTemplate } from "@langchain/core/prompts"
import { llm } from "../config/llm.js";
import { DocumentInterface } from "@langchain/core/documents";


interface ISource {
    fileName: string;
    pageNumber: number;
    chunkIndex: number;
}

interface IGenerationParams {
    userQuery: string;
    contextOfTopKChunks: DocumentInterface[];
}

const formatSources = (contextOfTopKChunks: DocumentInterface[]): ISource[] => {
    return contextOfTopKChunks.map((doc: DocumentInterface) => ({
        fileName: doc.metadata?.fileName || "Document",
        chunkIndex: Number(doc.metadata?.chunkIndex ?? 0),
        pageNumber: Number(doc.metadata?.["loc.pageNumber"] ?? doc.metadata?.pageNumber ?? 1)
    }));
};

const getPromptChain = () => {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `You are a helpful document assistant.

Answer the user's question using the provided document context as your primary source.

Guidelines:
- Give accurate, concise, and easy-to-understand answers.
- Use relevant information from the context to support the answer.
- When the context provides only part of the answer, answer using that information and clearly indicate what is covered.
- When the requested information is not present in the context, politely state that the documents don't provide enough information to answer it.
- Do not invent facts, citations, page numbers, or details that are not supported by the context.
- For summaries, explanations, comparisons, and follow-up questions, use the relevant information from the documents.
- Preserve important names, numbers, dates, terminology, and relationships from the documents.

Document context:
{context}`,
        ],
        ["user", "{question}"],
    ]);

    return prompt.pipe(llm.gemini);
};

export const generateAnswerStream = async ({
    userQuery,
    contextOfTopKChunks
}: IGenerationParams) => {
    const context = contextOfTopKChunks.map((doc) => doc.pageContent).join("\n");
    const chain = getPromptChain();

    const stream = await chain.stream({
        context: context,
        question: userQuery
    });

    const sources = formatSources(contextOfTopKChunks);

    return {
        stream,
        sources
    };
};

export const generateAnswer = async ({
    userQuery,
    contextOfTopKChunks
}: IGenerationParams): Promise<{ answer: string | undefined, sources: ISource[] }> => {
    const context = contextOfTopKChunks.map((doc) => doc.pageContent).join("\n");
    const chain = getPromptChain();

    const response = await chain.invoke({
        context: context,
        question: userQuery
    });

    return {
        answer: response.content.toString(),
        sources: formatSources(contextOfTopKChunks)
    };
};

export default generateAnswer;



