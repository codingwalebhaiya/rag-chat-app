import fs from "fs"
import { PDFParse } from 'pdf-parse';


export const extactPdfText = async (filePath: string) => {
    console.log(filePath)
    const buffer = fs.readFileSync(filePath);
    const unit8Array = new Uint8Array(buffer);
    const data = new PDFParse(unit8Array);
    console.log(data)
    return data.getText();
} 