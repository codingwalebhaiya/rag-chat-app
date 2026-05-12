import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

export const chunkText = async (text: string) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
         separators: [
            "\n\n",
            "\n",
            ".",
            " "
        ]
    })

    return splitter.createDocuments([text])
}