import fs from "fs"
import * as pdfParse from "pdf-parse"


export const extactPdfText = async (filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    const data = await (pdfParse as any)(buffer);
    return data.text;
}