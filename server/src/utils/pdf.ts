import { PDFParse } from 'pdf-parse';

export const extactPdfText = async (buffer: Buffer) => {
    const unit8Array = new Uint8Array(buffer);
    const data = new PDFParse(unit8Array) ;
    return data.getText();
} 