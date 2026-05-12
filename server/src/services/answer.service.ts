import { llm } from "../config/gemini.js"

export const generateAnswer = async (
  query: string,
  context: string
) => {
  const prompt = `
You are a helpful document assistant.

Context:
${context}

Question:
${query}

Answer using only context.
If missing, say: "Not found in uploaded documents"
`

  const response = await llm.invoke(prompt)

  return response.content
}