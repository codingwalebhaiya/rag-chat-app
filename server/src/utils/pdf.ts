import { PDFParse } from "pdf-parse";
import { Document } from "@langchain/core/documents";

export interface PdfPageMetadata {
    pageNumber: number;
}

export const loadPdfDocuments = async (buffer: Buffer): Promise<{ documents: Document<PdfPageMetadata>[], totalPages: number }> => {

    const parser = new PDFParse(new Uint8Array(buffer))
    const result = await parser.getText();

    const documents = result.pages.map((page) => {
        return new Document<PdfPageMetadata>({
            pageContent: page.text,
            metadata: {
                pageNumber: page.num,
            }
        })
    })

    return { documents, totalPages: result.pages.length };
} 