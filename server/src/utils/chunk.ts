import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

export const chunkText = async (pages: { text: string; num: number }[]) => {
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

    const docs = [];
    for (const page of pages) {
        const chunks = await splitter.createDocuments([page.text], [{ pageNumber: page.num }])

        docs.push(...chunks)
    }

    return docs;


}